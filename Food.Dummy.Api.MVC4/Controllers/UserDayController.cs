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
        // GET api/userday
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
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
