using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Food.Api.Models
{
    public class ShareToBindingModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Amount  must be a positive number")]
        public int Amount { get; set; }
    }
}