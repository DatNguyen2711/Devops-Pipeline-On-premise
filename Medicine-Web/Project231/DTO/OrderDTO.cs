namespace Project231.DTO
{
    public class OrderDTO
    {
        public int Id { get; set; }

        public string? CustomerName {  get; set; }      

        public string? OrderNo { get; set; }
        public DateTime? OrderDate { get; set; }

        public decimal? OrderTotal { get; set; }

        public string? OrderStatus { get; set; }
    }
}
