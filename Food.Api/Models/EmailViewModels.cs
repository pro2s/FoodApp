using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Food.Api.Models
{
    public class EmailConfirmViewModel
    {
        public string UserName { get; set; }
        public string Url { get; set; }
    }
}