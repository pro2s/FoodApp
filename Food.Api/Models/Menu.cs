using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Food.Api.Models
{

    public enum MenuType
    {
        NoneMenu = -1,
        NormalMenu = 0,
        NextMonday = 8,
        ParserTemplate = 100
    }

    public class Menu
    {
        public int Id { get; set; }
        public string Name { get; set; }

        [Precision(10, 2)]
        public decimal Price { get; set; }

        public DateTime? OnDate { get; set; }
        public MenuType Type { get; set; }
        public virtual ParserTemplate ParserTemplate { get; set; }
        public virtual ICollection<Item> Items { get; set; }

        public Menu()
        {
            Items = new HashSet<Item>();
        }
    }
}