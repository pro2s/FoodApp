using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Food.Api.Models
{
    public class MenuItem : ICloneable
    {
        public int Id { get; set; }

        [ForeignKey("Menu")]
        public int MenuId { get; set; }
        public virtual Menu Menu { get; set; }

        public string Name { get; set; }
        public string Parts { get; set; }
        public string Weight { get; set; }

        public object Clone()
        {
            var item = new MenuItem
            {
                Name = Name,
                Parts = Parts,
                Weight = Weight,
            };
            return item;
        }
        
    }
}