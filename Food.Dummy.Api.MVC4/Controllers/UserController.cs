using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Food.Dummy.Api.MVC4.Controllers
{
    [AllowCrossSiteJson]
    public class UserController : ApiController
    {
        public class FoodUser
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public int Bill { get; set; }
        }

        // GET api/user
        public IEnumerable<FoodUser> Get()
        {
            List<FoodUser> list = new List<FoodUser>(){
                new FoodUser() {Id=1, Name = "User Long Name A", Bill = 0},
                new FoodUser() {Id=2, Name = "User B", Bill = 100000},
                new FoodUser() {Id=3, Name = "User C", Bill = 200000},
                new FoodUser() {Id=4, Name = "User D", Bill = 300000},
            };
            return list;
        }

        // GET api/user/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/user
        public void Post([FromBody]string value)
        {
        }

        // PUT api/user/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/user/5
        public void Delete(int id)
        {
        }
    }
}
