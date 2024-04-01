using System;
using System.Collections.Generic;

namespace Project231.Models;

public partial class Cart
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public int? MedicineId { get; set; }

    public decimal? UnitPrice { get; set; }

    public decimal? Discount { get; set; }

    public int? Quantity { get; set; }

    public decimal? TotalPrice { get; set; }

    public virtual Medicine? Medicine { get; set; }

    public virtual User? User { get; set; }
}
