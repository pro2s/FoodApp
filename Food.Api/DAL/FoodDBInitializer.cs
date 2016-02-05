using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using Food.Api.Models;

namespace Food.Api.DAL
{
    public class FoodDBInitializer : DropCreateDatabaseAlways<FoodDBContext>
    {
        protected override void Seed(FoodDBContext context)
        {
            var menus = new List<Menu>
            {
            new Menu {Name="Без обеда", type = MenuType.NoneMenu},
            new Menu {Name="Полный обед", Price=35000, type = MenuType.NextMonday },
            new Menu {Name="Без превого", Price=30000, type = MenuType.NextMonday },
            };

            menus.ForEach(m => context.Menus.Add(m));
            context.SaveChanges();
        }
    }
}