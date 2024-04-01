namespace Project231.DTO
{
    public class OrderItemDTO
    {
        public int Id { get; set; }

        public int? OrderId { get; set; }

        public virtual MedicineDTO Medicine{ get; set; }

        public decimal? UnitPrice { get; set; }

        public decimal? Discount { get; set; }

        public int? Quantity { get; set; }

        public decimal? TotalPrice { get; set; }
    }
}
