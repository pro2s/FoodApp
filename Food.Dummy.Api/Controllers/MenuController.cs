using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Food.Dummy.Api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MenuController : ApiController
    {


        // GET: api/Menu
        
        public IEnumerable<Menu> Get()
        {
            WeekMenu week = new WeekMenu();
            return week.Get();
        }

        // GET: api/Menu/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Menu
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Menu/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Menu/5
        public void Delete(int id)
        {
        }
    }
}
