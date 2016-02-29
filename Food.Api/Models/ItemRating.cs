using Newtonsoft.Json;
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

        [JsonIgnore]
        public virtual Item Item { get; set; }
        
        public string UserId { get; set; }
        public int Rate { get; set; }
        public DateTime? Date { get; set; }

    }

    public class ViewRating
    {
        public int Rating { get; set; }
        public int AvgRating { get; set; }
    }
}