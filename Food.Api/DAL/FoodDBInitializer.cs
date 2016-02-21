using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using Food.Api.Models;

namespace Food.Api.DAL
{
    public class FoodDBInitializer : CreateDatabaseIfNotExists<FoodDBContext>
    {
        protected override void Seed(FoodDBContext context)
        {
            var menus = new List<Models.Menu>
            {
            new Models.Menu {Name="Без обеда", Type = MenuType.NoneMenu},
            new Models.Menu {Name="Полный обед", Price=35000, Type = MenuType.NextMonday },
            new Models.Menu {Name="Без превого", Price=30000, Type = MenuType.NextMonday },
            };

            menus.ForEach(m => context.Menus.Add(m));
            context.SaveChanges();
            base.Seed(context);
        }
    }
}