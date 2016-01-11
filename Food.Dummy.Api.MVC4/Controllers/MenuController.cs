using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Food.Dummy.Api.MVC4.Controllers
{
    using System.Web.Http.Filters;

    public class AllowCrossSiteJsonAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.Response != null)
                actionExecutedContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");

            base.OnActionExecuted(actionExecutedContext);
        }
    }

    [AllowCrossSiteJson]
    public class MenuController : ApiController
    {
        // GET api/menu
        public IEnumerable<Menu> Get()
        {
            WeekMenu week = new WeekMenu();
            week.LoadDoc();
            return week.Get();
        }

        // GET api/menu/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/menu
        public void Post([FromBody]string value)
        {
        }

        // PUT api/menu/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/menu/5
        public void Delete(int id)
        {
        }
    }
}
