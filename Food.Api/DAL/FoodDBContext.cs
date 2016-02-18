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
            Database.SetInitializer(new CreateDatabaseIfNotExists<FoodDBContext>());
            Database.SetInitializer(new FoodDBInitializer());
            base.Configuration.ProxyCreationEnabled = false;
        }

        public DbSet<Menu> Menus { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<ItemRating> ItemRatings { get; set; }
        public DbSet<UserChoice> UserChoices { get; set; }
        public DbSet<Payment> Payments { get; set; }
       
        /*
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            /*
            modelBuilder.Entity<Menu>()
                .HasMany(c => c.Items)
                .WithMany()             
                .Map(x =>
                {
                    x.MapLeftKey("MenuId");
                    x.MapRightKey("ItemId");
                    x.ToTable("MenuItems");
                });
        
            base.OnModelCreating(modelBuilder);
        }
        */
    }
}