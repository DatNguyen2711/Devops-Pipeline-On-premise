using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Project231.DTO;
using Project231.Models;
using Project231.Services;

namespace Project231.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {

        private readonly ProjectPrn231Context _context;
        private readonly TokenService _tokenService;
        private readonly IConfiguration _configuration;

        public AdminController(ProjectPrn231Context context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _tokenService = new TokenService(_configuration["JWT:Secret"]);

        }

        [HttpPost("AddMedicine")]
        public IActionResult AddMedicine(MedicineDTO newMedicine, [FromHeader] string Authorization)
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
                if (userRole != "Admin")
                {
                    return Unauthorized(new { message = "You do not have permission to perform this action." });
                }

                Medicine medicine = new Medicine
                {
                    Name = newMedicine.Name,
                    Status = newMedicine.Status,
                    Discount = newMedicine.Discount,
                    UnitPrice = newMedicine.UnitPrice,
                    Manufacturer = newMedicine.Manufacturer,
                    Quantity = newMedicine.Quantity,
                    ExpDate = newMedicine.ExpDate,
                    ImageUrl = newMedicine.ImageUrl,
                };
                _context.Medicines.Add(medicine);
                _context.SaveChanges();

                return Ok(new { message = "Medicine added successfully.", medicine });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding medicine: " + ex.Message });
            }
        }

          [HttpGet("ViewUsers")]
        public IActionResult ViewUsers( [FromHeader] string Authorization)
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
                if (userRole != "Admin")
                {
                    return Unauthorized(new { message = "You do not have permission to perform this action." });
                }
                var users = _context.Users.ToList();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching users: " + ex.Message });
            }
        }


        [HttpPut("BlockUser/{id}")]
        public IActionResult BlockUser(int id, [FromHeader] string Authorization)
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
                if (userRole != "Admin")
                {
                    return Unauthorized(new { message = "You do not have permission to perform this action." });
                }
                var user = _context.Users.FirstOrDefault(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }

                user.Status = 0; // Set status to 0 to block the user
                _context.SaveChanges();

                return Ok(new { message = "User blocked successfully.", user });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while blocking the user: " + ex.Message });
            }
        }

        [HttpPut("UnBlockUser/{id}")]
        public IActionResult UnBlockUser(int id, [FromHeader] string Authorization)
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
                if (userRole != "Admin")
                {
                    return Unauthorized(new { message = "You do not have permission to perform this action." });
                }
                var user = _context.Users.FirstOrDefault(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }

                user.Status = 1; // Set status to 0 to block the user
                _context.SaveChanges();

                return Ok(new { message = "User blocked successfully.", user });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while blocking the user: " + ex.Message });
            }
        }

    }
}
