using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Food.Api.Models
{
    public class ItemRating
    {
        public int Id { get; set; }

        [ForeignKey("Item")]
        public int ItemId { get; set; }
        public virtual Item Item { get; set; }
        
        public string UserId { get; set; }
        public int Raiting { get; set; }
        public DateTime? Date { get; set; }

    }

    public class ViewRating
    {
        public int Rating { get; set; }
        public int AvgRating { get; set; }
    }
}