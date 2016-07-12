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
            
            base.Configuration.ProxyCreationEnabled = false;
        }

        public DbSet<Menu> Menus { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<ItemRating> ItemRatings { get; set; }
        public DbSet<ItemComment> ItemComments { get; set; }
        public DbSet<UserChoice> UserChoices { get; set; }
        public DbSet<Payment> Payments { get; set; }
       
        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
           
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

        public decimal GetUserBalance(string userId)
        {
            // Get User Balance
            decimal debit = Payments.Where(p => p.UserID == userId).Sum(p => (decimal?)p.Sum) ?? 0;
            decimal credit = UserChoices.Where(uc => uc.UserID == userId && uc.confirm).Sum(uc => (decimal?)uc.Menu.Price) ?? 0;
            return debit - credit;
        }
        
    }
}