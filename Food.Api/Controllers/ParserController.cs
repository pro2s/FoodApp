using Food.Api.DAL;
using Food.Api.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
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
        public IHttpActionResult ParseMenu(string id, DateTime? start = null, int count = 0, bool update = false, bool next = false)
        {
            var result = new ParserResultView();
            DateTime nextmonday;
            if (start!=null)
            {
                start = start.Value.Date;
                nextmonday = (DateTime)start;
                nextmonday = nextmonday.StartOfWeek(); 
            }
            else
            {
                nextmonday = DateTime.Today.StartOfWeek().AddDays(7);
            }
            

            var parser = allParsers.FirstOrDefault(p => p.Id() == id);
            if (parser == null)
            {
                return NotFound();
            }

            DateTime? old = null;
            List<Menu> menus = parser.ParseMenu(start);
            
            int num = 1;
            foreach (var menu in menus)
            {
                if (old == null)
                {
                    old = menu.OnDate;
                }

                if (old != menu.OnDate)
                {
                    ++num;
                }

                if (count > 0 && count < num)
                {
                    break;
                }

                foreach (var item in menu.Items.ToList())
                {
                    var dbitem = db.Items.Where(i => i.Name == item.Name && i.Weight == item.Weight).FirstOrDefault();
                    if (dbitem != null)
                    {
                        string dbParts = dbitem.Parts ?? "";
                        string menuParts = item.Parts ?? "";
                        if(dbParts.Length < menuParts.Length)
                        {
                            dbitem.Parts = item.Parts;
                            db.Entry(dbitem).State = EntityState.Modified;
                        }
                        menu.Items.Remove(item);
                        menu.Items.Add(dbitem);
                    }
                }

                if (update)
                {
                    var dbmenu = db.Menus
                        .Where
                        (
                            m => m.Name == menu.Name &&
                            DbFunctions.TruncateTime(m.OnDate) == DbFunctions.TruncateTime(menu.OnDate) 
                            && m.Price == menu.Price 
                            && m.Type == menu.Type
                        )
                        .Include("Items")
                        .FirstOrDefault();
                    if (dbmenu != null)
                    {
                        dbmenu.Items = menu.Items;
                        db.Entry(dbmenu).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                }
                else
                {
                    db.Menus.Add(menu);
                    db.SaveChanges();
                }

            }

            if (next)
            {
                var nextmenus = parser.GetDayMenu();
                foreach (Menu menu in nextmenus)
                {
                    menu.OnDate = nextmonday;
                    menu.Items.Clear();
                    db.Menus.Add(menu);
                    db.SaveChanges();
                }
                ++num;
            }

            result.Message = string.Format("Parse complete, get {0} menus.", num);

            return Ok(result);
        }
    }

}
