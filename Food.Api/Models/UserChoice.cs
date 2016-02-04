using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Food.Api.Models
{
    public class UserChoice
    {
        public int Id { get; set; }
        public string UserID { get; set; }
        public DateTime date { get; set; }

        [ForeignKey("Menu")]
        public int MenuId { get; set; }
        public virtual Menu Menu { get; set; }

        public bool confirm { get; set; }

    }
}