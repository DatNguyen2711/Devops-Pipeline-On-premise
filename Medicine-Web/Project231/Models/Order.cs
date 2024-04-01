using System;
using System.Collections.Generic;

namespace Project231.Models;

public partial class Order
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public string? OrderNo { get; set; }

    public decimal? OrderTotal { get; set; }

    public string? OrderStatus { get; set; }

    public DateTime? OrderDate { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual User? User { get; set; }
}
