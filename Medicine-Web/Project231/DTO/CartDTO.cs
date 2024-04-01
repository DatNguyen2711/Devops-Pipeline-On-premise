namespace Project231.DTO
{
    public class CartDTO
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }

        public string? CustomerName { get; set; }

        public string MedicineName { get; set; }

        public decimal? UnitPrice { get; set; }

        public decimal? Discount { get; set; }

        public int? Quantity { get; set; }

        public decimal? TotalPrice { get; set; }
    }
}
