using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Food.Api.Models
{

    public class StatisticViewModel
    {
        public List<TotalStatistic> Totals { get; set; }
        public List<TopStatistic> Tops { get; set; }

        public StatisticViewModel()
        {
            Totals = new List<TotalStatistic>();
            Tops = new List<TopStatistic>();
        }
    }

    public class TopStatistic
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string  ValueTitle { get; set; }
        public int Count { get; set; }
        public List<UserData> Data { get; set; }
    }

    public class UserData
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Value { get; set; }
    }

    public class TotalStatistic
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
    }


}