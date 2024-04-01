namespace Project231.Models
{
    public class Response
    {
        public int StatusCode { get; set; }
        public string StatusMessage { get; set; }
        public List<User> ListUsers { get; set; }
        public User User { get; set; }
        public List<Medicine> ListMedicines { get; set; }
        public Medicine Medicine { get; set; }
        public List<Cart> ListCart { get; set; }
        public List<Order> ListOrders { get; set; }
        public Order Order { get; set; }
        public List<OrderItem> ListItems { get; set; }
        public OrderItem OrderItem { get; set; }

    }
}
