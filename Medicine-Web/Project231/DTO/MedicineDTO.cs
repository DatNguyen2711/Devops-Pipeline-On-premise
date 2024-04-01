namespace Project231.DTO
{
    public class MedicineDTO
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public string? Manufacturer { get; set; }
        public int Status { get; set; }

        public decimal? UnitPrice { get; set; }

        public decimal? Discount { get; set; }

        public int? Quantity { get; set; }

        public DateTime? ExpDate { get; set; }

        public string? ImageUrl { get; set; }

    }
}
