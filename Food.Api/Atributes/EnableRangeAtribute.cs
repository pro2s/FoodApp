using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace Food.Api.Atributes
{
    public class EnableRangeAttribute : ActionFilterAttribute
    {

        private const string EnityRangeUnit = "x-entity";
        
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            var _requestRangeHeader = actionContext.Request.Headers.Range;

            if (_requestRangeHeader != null)
            {
                if (_requestRangeHeader.Unit != EnityRangeUnit)
                {
                    throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.RequestedRangeNotSatisfiable));
                }
                else
                {
                    // only support one range 
                    var rangeItemHeaderValue = _requestRangeHeader.Ranges.First();
                    // calculate and add header 
                    var from = (int)rangeItemHeaderValue.From;
                    var to = (int?)rangeItemHeaderValue.To;
                    actionContext.ActionArguments["range"] = true;
                    actionContext.ActionArguments["from"] = from;
                    actionContext.ActionArguments["to"] = to;
                }

            }
            base.OnActionExecuting(actionContext);
        }

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            var _requestRangeHeader = actionExecutedContext.Request.Headers.Range;

            if (actionExecutedContext.Exception == null && actionExecutedContext.Response.IsSuccessStatusCode)
            {

                if (_requestRangeHeader == null)
                {
                    // if no header, put Accept range header to tell teh client it is supported 
                    actionExecutedContext.Response.Headers.Add("Accept-Ranges", EnityRangeUnit);
                }
                else
                {

                    var objectContent = actionExecutedContext.Response.Content as ObjectContent;
                    if (objectContent != null)
                    {

                        var value = objectContent.Value as IList;
                        
                        var rangeItemHeaderValue = _requestRangeHeader.Ranges.First(); // only support one range 
                        

                        // calculate and add header 
                        var from = (int)rangeItemHeaderValue.From;
                        var to = (int?)rangeItemHeaderValue.To;
                        string toString = to.HasValue ? to.Value.ToString() : "*";
                        string countString = "*";
                        
                        var collection = value as ICollection; // if underlying a collection we can find out count without iterating 

                        if (collection != null && collection.Count > 0)
                        {
                            if (actionExecutedContext.Request.Headers.Contains("X-Range-Total"))
                            {
                                var total = actionExecutedContext.Request.Headers.GetValues("X-Range-Total").FirstOrDefault();
                                int total_int;
                                if (int.TryParse(total, out total_int))
                                {
                                    countString = total;
                                    to = to.HasValue ? Math.Min(to.Value, total_int - 1) : total_int - 1;
                                    toString = to.ToString();
                                }
                            }

                            actionExecutedContext.Response.Content.Headers.Add("Access-Control-Expose-Headers",
                                "content-range");
                            actionExecutedContext.Response.Content.Headers.Add("content-range",
                                string.Format("{0} {1}-{2}/{3}", EnityRangeUnit, from, toString, countString));
                            
                            // set status to 206
                            actionExecutedContext.Response.StatusCode = HttpStatusCode.PartialContent;
                        }
                    }

                }

            }

            base.OnActionExecuted(actionExecutedContext);
        }
    }
}