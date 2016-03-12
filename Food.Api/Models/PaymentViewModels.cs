using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Food.Api.Models
{
    public class PaymentViewModel
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public DateTime Date { get; set; }
        public int Sum { get; set; }
        public string UserName { get; set; }
    }
}