using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Filters;

namespace Food.Api.Controllers
{
    public class AllowCrossSiteJsonAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.Response != null)
            {
                actionExecutedContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
                actionExecutedContext.Response.Headers.Add("Access-Control-Allow-Headers", "X-AspNet-Version,X-Powered-By,Date,Server,Accept,Accept-Encoding,Accept-Language,Cache-Control,Connection,Content-Length,Content-Type,Host,Origin,Pragma,Referer,User-Agent");
                actionExecutedContext.Response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
            }
            base.OnActionExecuted(actionExecutedContext);
        }
    }

}