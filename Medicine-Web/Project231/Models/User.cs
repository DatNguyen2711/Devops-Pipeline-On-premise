using System;
using System.Collections.Generic;

namespace Project231.Models;

public partial class User
{
    public int Id { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Password { get; set; }

    public string? Email { get; set; }

    public decimal? Fund { get; set; }

    public string? Type { get; set; }

    public int? Status { get; set; }

    public DateTime? CreatedOn { get; set; }

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
