using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using Food.Api.Models;

namespace Food.Api.DAL
{
    public class FoodDBContext : DbContext
    {

        public FoodDBContext() : base("DefaultConnection")
        {
            Database.SetInitializer(new FoodDBInitializer());
            base.Configuration.ProxyCreationEnabled = false;
        }

        public DbSet<Models.Menu> Menus { get; set; }
        public DbSet<Models.MenuItem> MenuItems { get; set; }
        public DbSet<UserChoice> UserChoices { get; set; }
        public DbSet<Payment> Payments { get; set; }

        
    }
}