using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace Food.Api.Models
{
    public class FoodDBContext : DbContext
    {
        public DbSet<Menu> Menu { get; set; }
        public DbSet<MenuItem> Items { get; set; }
        public DbSet<UserChoice> UserChoice { get; set; }
        public DbSet<Payment> Payment { get; set; }


    }
}