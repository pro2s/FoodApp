using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Food.Api.Models
{
    public class ItemComment
    {
        public int Id { get; set; }

        [ForeignKey("Item")]
        public int ItemId { get; set; }

        [JsonIgnore]
        public virtual Item Item { get; set; }

        public string UserId { get; set; }
        public DateTime? Date { get; set; }
        public string Text { get; set; }

    }

    public class ItemCommentViewModel
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string UserName { get; set; }
        public DateTime? Date { get; set; }
        public string Text { get; set; }
    }

    public class ItemCommentBindModel
    {
        public int ItemId { get; set; }
        public string Text { get; set; }
    }
}