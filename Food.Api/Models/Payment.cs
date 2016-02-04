using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Food.Api.Models
{
    public class Payment
    {
        public int Id { get; set; }

        public string UserID { get; set; }
        public DateTime Date { get; set; }
        public int Sum { get; set; }

    }
}