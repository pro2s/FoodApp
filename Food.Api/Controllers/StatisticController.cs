using Food.Api.DAL;
using Food.Api.Models;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Http;

namespace Food.Api.Controllers
{
    [RoutePrefix("api/Statistic")]
    public class StatisticController : ApiController
    {
        private FoodDBContext db = new FoodDBContext();

        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        // GET: api/Statistic
        public IHttpActionResult Get()
        {
            StatisticViewModel result = new StatisticViewModel();
            TopStatistic top_0 = GetTopUsersByorder();
            result.Tops.Add(top_0);
            return Ok(result);
        }

        private TopStatistic GetTopUsersByorder()
        {
            TopStatistic result = new TopStatistic();
            result.Id = 0;
            result.Title = "Top users by order";
            result.Count = 10;
            result.ValueTitle = "Total";
            
            result.Data = db.UserChoices
                .Where(uc => uc.confirm)
                .GroupBy(uс => uс.UserID)
                .Select(uc => new UserData
                {
                    UserId = uc.Key,
                    UserName = "",
                    Value = uc.Count().ToString()
                })
                .Take(10)
                .OrderByDescending(ud => ud.Value)
                .ToList();

            Dictionary<string, ApplicationUser> users = UserManager.Users.ToDictionary(user => user.Id);
            foreach (var data in result.Data)
            {
                data.UserName = users[data.UserId].UserName;
            }
            
            return result;               
        }

        // GET: api/Statistic/Top/{id} 
        [Route ("Top/{id}", Name = "GetTop")]
        public IHttpActionResult GetTop(int id)
        {
            TopStatistic top = new TopStatistic();
            return Ok(top);
        }

        // GET: api/Statistic/Total/{id} 
        [Route("Total/{id}", Name = "GetTotal")]
        public IHttpActionResult GetTotal(int id)
        {
            TotalStatistic top = new TotalStatistic();
            return Ok(top);
        }
    }
}
