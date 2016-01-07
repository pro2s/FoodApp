using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Food.Dummy.Api.Controllers
{
    public class BillController : ApiController
    {

        public class FoodUser
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public int Bill { get; set; }
        }
        public class Bill
        {
            public List<FoodUser> users { get; set; }

        }
        
        // GET api/bill
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public Bill Get()
        {
            Bill bill = new Bill();

            bill.users = new List<FoodUser> 
            {
                new FoodUser() {Id=1, Name = "User A", Bill = 0},
                new FoodUser() {Id=2, Name = "User B", Bill = 100000},
                new FoodUser() {Id=3, Name = "User C", Bill = 200000},
                new FoodUser() {Id=4, Name = "User D", Bill = 300000},
            };

            return bill;
        }

        
        // GET api/bill/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/bill
        public void Post([FromBody]string value)
        {
        }

        // PUT api/bill/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/bill/5
        public void Delete(int id)
        {
        }
    }
}
