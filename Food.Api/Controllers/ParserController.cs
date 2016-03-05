using Food.Api.DAL;
using Food.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Food.Api.Controllers
{
    class ParserResultView
    {
        public string Message { get; set; }
    }

    public class ParserController : ApiController
    {
        private FoodDBContext db = new FoodDBContext();
        readonly IMenuParser[] allParsers;
        
        public ParserController(IMenuParser[] parsers)
        {
            allParsers = parsers;
        }

        [Route("api/Parser")]
        [Authorize(Roles = "Admin, GlobalAdmin")]
        [HttpGet]
        public IHttpActionResult GetParsers()
        {
            var result = allParsers.Select(p => p.GetInfo()).ToList();
            return Ok(result);
        }

        [Route("api/Parser/{id}")]
        [Authorize(Roles = "Admin, GlobalAdmin")]
        [HttpGet]
        public IHttpActionResult ParseMenu(string id)
        {
            var result = new ParserResultView();
            

            var parser = allParsers.FirstOrDefault(p => p.Id() == id);
            if (parser == null)
            {
                return NotFound();
            }

            List<Menu> menus = parser.ParseMenu();
            result.Message = string.Format("Parse complete, get {0} menus.", menus.Count);
            foreach (var menu in menus)
            {


                foreach (var item in menu.Items.ToList())
                {
                    var dbitem = db.Items.Where(i => i.Name == item.Name && i.Weight == item.Weight).FirstOrDefault();
                    if (dbitem != null)
                    {
                        //db.Entry(item).State = EntityState.Detached;
                        menu.Items.Remove(item);
                        menu.Items.Add(dbitem);
                    }
                }
                db.Menus.Add(menu);
                db.SaveChanges();
            }
            
            return Ok(result);
        }
    }
}
