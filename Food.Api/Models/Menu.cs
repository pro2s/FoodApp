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
    }

    public class Menu
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public DateTime? OnDate { get; set; }
        public MenuType type { get; set; }

        public virtual List<MenuItem> Items { get; set; }
    }
}