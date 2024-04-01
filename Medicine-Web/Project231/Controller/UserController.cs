using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Project231.DTO;
using Project231.Models;
using Project231.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace Project231.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ProjectPrn231Context _context;
        private readonly IConfiguration _configuration;
        private readonly TokenService _tokenService;

        public UserController(ProjectPrn231Context context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _tokenService = new TokenService(_configuration["JWT:Secret"]);
        }


        private string GenerateNewJsonWebToken(List<Claim> claims)
        {
            var authSecret = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var tokenObject = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidateIssuer"],
                    audience: _configuration["JWT:ValidateAudience"],
                    expires: DateTime.Now.AddDays(1),
                    claims: claims,
                    signingCredentials: new SigningCredentials(authSecret, SecurityAlgorithms.HmacSha256)
                );

            string token = new JwtSecurityTokenHandler().WriteToken(tokenObject);

            return token;

        }
        [HttpPost("Signup")]
        public IActionResult Register(UserRequestDTO newUserDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var existingUser = _context.Users.FirstOrDefault(u => u.Email == newUserDTO.Email);
                    if (existingUser != null)
                    {
                        return BadRequest(new { message = "Email already existed !!!." });
                    }
                    var newUser = new User
                    {
                        FirstName = newUserDTO.FirstName,
                        LastName = newUserDTO.LastName,
                        Email = newUserDTO.Email,
                        Password = newUserDTO.Password,
                        CreatedOn = DateTime.Now,
                        Status = 1,
                        Fund = 0,
                        Type = "User"
                    };

                    _context.Users.Add(newUser);
                    _context.SaveChanges();
                    return Ok(new { message = "Register Successfully !", user = newUser });
                }
                else
                {
                    return BadRequest(new { message = "Invalid user data." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while registering user: " + ex.Message });
            }
        }




        [HttpPost("Login")]
        public IActionResult Login(UserLoginDTO loginDTO)
        {
            try
            {
                var user = _context.Users.SingleOrDefault(u => u.Email == loginDTO.Email);

                if (user == null || user.Password != loginDTO.Password)
                {
                    return Unauthorized(new { message = "Invalid email or password." });
                }
                if (user.Status == 0)
                {
                    return Unauthorized(new { message = "Your account has been blocked." });
                }

                var authClaims = new List<Claim>
                  {
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, user.Type),
                new Claim("JWTID", Guid.NewGuid().ToString()),
                };
                var token = GenerateNewJsonWebToken(authClaims);
                return Ok(new { message = "Login successful.", user, token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while logging in: " + ex.Message });
            }
        }




        [HttpGet("Profile/{id}")]
        public IActionResult UserProfile(int id, [FromHeader] string Authorization)
        {
            try
            {
                if (string.IsNullOrEmpty(Authorization))
                {
                    return BadRequest(new { message = "Authorization header is missing." });
                }

                var token = Authorization.Split(' ')[1];
                var claimsPrincipal = _tokenService.DecodeToken(token);

                var userRole = claimsPrincipal.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
                if (userRole == null)
                {
                    return Unauthorized(new { message = "You not authorized." });
                }
                var user = _context.Users.FirstOrDefault(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new { message = "User not fount." });
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error occuring when updated profile: " + ex.Message });
            }
        }
        [HttpPut("UpdateProfile/{id}")]
        public IActionResult UpdateProfile(int id, UserProfileDTO profileDTO, [FromHeader] string Authorization)
        {
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.Id == id);
                if (string.IsNullOrEmpty(Authorization))
                {
                    return BadRequest(new { message = "Authorization header is missing." });
                }

                var token = Authorization.Split(' ')[1];
                var claimsPrincipal = _tokenService.DecodeToken(token);

                var userRole = claimsPrincipal.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
                if (userRole == null)
                {
                    return Unauthorized(new { message = "You not authorized." });
                }
                if (user == null)
                {
                    return NotFound(new { message = "User not fount." });
                }
                if (user.Email != profileDTO.Email)
                {
                    var emailExists = _context.Users.Any(u => u.Email == profileDTO.Email);
                    if (emailExists)
                    {
                        return BadRequest(new { message = "Email already existed ." });
                    }
                }
                user.FirstName = profileDTO.FirstName;
                user.LastName = profileDTO.LastName;
                user.Email = profileDTO.Email;
                user.Password = profileDTO.Password;

                _context.SaveChanges();

                return Ok(new { message = "Information updated successfully !.", user });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error occuring when updated profile: " + ex.Message });
            }
        }

    }
}
