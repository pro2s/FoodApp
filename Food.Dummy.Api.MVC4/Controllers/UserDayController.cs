using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Food.Dummy.Api.MVC4.Controllers
{
    public class UserDayController : ApiController
    {
        public class UserDay
        {
            public int Id { get; set; }
            public int UserId { get; set; }
            public DateTime Date { get; set; }
            public Menu select { get; set; }
        }

        // GET api/userday
        public IEnumerable<UserDay> Get()
        {
            DateTime MondayDay = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek + 1);

            List<UserDay> days = new List<UserDay>();

            // TODO: Get days from base, if no exist generate like this
            for (int i = 0; i < 5; i++)
            {
                days.Add(new UserDay() {UserId = 1, Id = i, Date = MondayDay.AddDays(i), select = WeekMenu.NoChoice});

            };

            return days;
        }

        // GET api/userday/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/userday
        public void Post([FromBody]string value)
        {
        }

        // PUT api/userday/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/userday/5
        public void Delete(int id)
        {
        }
    }
}
