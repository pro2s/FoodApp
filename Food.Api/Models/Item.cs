using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Food.Api.Models
{
    public class Item : ICloneable
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string Parts { get; set; }
        public string Weight { get; set; }

        public ICollection<Menu> Menus { get; set; }
        public ICollection<ItemRating> Ratings { get; set; }

        public Item()
        {
            Menus = new HashSet<Menu>();
        }

        public object Clone()
        {
            var item = new Item
            {
                Name = Name,
                Parts = Parts,
                Weight = Weight,
            };
            return item;
        }
        
    }
}