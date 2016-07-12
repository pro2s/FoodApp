using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Food.Api.Models
{
    public class ParserTemplate
    {
        [Key, ForeignKey("Menu")]
        public int MenuId { get; set; }
        public string Parser { get; set; }
    }
}