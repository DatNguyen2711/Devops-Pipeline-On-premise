using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project231.DTO;
using Project231.Models;
using Project231.Services;

namespace Project231.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ProjectPrn231Context _context;
        private readonly IConfiguration _configuration;
        private readonly TokenService _tokenService;

        public CartController(ProjectPrn231Context context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _tokenService = new TokenService(_configuration["JWT:Secret"]);
        }

        [HttpPost("AddToCart")]
        public IActionResult AddToCart(int userId, int medicineId, int quantity)
        {
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.Id == userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }

                var medicine = _context.Medicines.FirstOrDefault(m => m.Id == medicineId);
                if (medicine == null)
                {
                    return NotFound(new { message = "Medicine not found." });
                }
                decimal totalPrice = quantity * medicine.UnitPrice ?? 0;
                if (medicine.Discount != null)
                {
                    totalPrice -= (totalPrice * medicine.Discount.Value / 100);
                }
                var cartItem = new Cart
                {
                    UserId = userId,
                    MedicineId = medicineId,
                    Quantity = quantity,
                    UnitPrice = medicine.UnitPrice,
                    Discount = medicine.Discount,
                    TotalPrice = totalPrice
                };

                _context.Carts.Add(cartItem);
                _context.SaveChanges();

                return Ok(new { message = "Add to cart successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error occured: " + ex.Message });
            }
        }
        [HttpDelete("RemoveItemFromCart/{cartItemId}")]
        public IActionResult RemoveItemFromCart(int cartItemId)
        {
            try
            {
                var cartItem = _context.Carts.FirstOrDefault(c => c.Id == cartItemId);

                if (cartItem == null)
                {
                    return NotFound(new { message = "Item not found in the cart." });
                }

                _context.Carts.Remove(cartItem);
                _context.SaveChanges();

                return Ok(new { message = "Item removed from the cart successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while removing item from the cart: " + ex.Message });
            }
        }
        [HttpGet("GetAllCartItem")]
        public IActionResult GetAllCartItem()
        {
            try
            {
                var carts = _context.Carts.Include(x => x.Medicine).Include(x => x.User).ToList();
                var res = carts.Select(x => new CartDTO()
                {
                    Id = x.Id,
                    CustomerId = x.User.Id,
                    CustomerName = x.User.FirstName + x.User.LastName,
                    MedicineName = x.Medicine.Name,
                    Discount = x.Discount,
                    Quantity = x.Quantity,
                    TotalPrice = x.TotalPrice,
                    UnitPrice = x.UnitPrice
                }).ToList();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching cart items: " + ex.Message });
            }
        }
        [HttpGet("GetAllCartItemOfUser/{id}")]
        public IActionResult GetAllCartItemOfUser(int id)
        {
            try
            {
                var carts = _context.Carts.Include(x => x.Medicine).Include(x => x.User).Where(x => x.UserId == id).ToList();

                var res = carts.Select(x => new CartDTO()
                {
                    Id = x.Id,
                    CustomerId = x.User.Id,
                    CustomerName = x.User.FirstName  + x.User.LastName, 
                    MedicineName = x.Medicine.Name,
                    Discount = x.Discount,
                    Quantity = x.Quantity,
                    TotalPrice = x.TotalPrice,
                    UnitPrice = x.UnitPrice
                }).ToList();

                return Ok(res); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching cart items: " + ex.Message });
            }
        }

    }
}
