using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Food.Api.DAL;
using Food.Api.Models;
using System.Web.Http.Cors;
using Microsoft.AspNet.Identity;

namespace Food.Api.Controllers
{
    /// <summary>
    /// Api for menu.
    /// </summary>
    public class MenusController : ApiController
    {
        private FoodDBContext db = new FoodDBContext();
        

        
        private void CalculateRatings(List<Menu> menus)
        {
            string UserId = User.Identity.GetUserId();
            //TODO: rewrite to sql 
            foreach (var menu in menus)
            {
                menu.Items = menu.Items.OrderBy(i => i.Order).ToList();
                foreach (var item in menu.Items)
                {
                    // if ratings not calculated (present raiting with id = -1)
                    if (!item.Ratings.Where(ir=> ir.Id < 0).Any())
                    {
                        var AllRatings = item.Ratings.ToList();
                        item.Ratings.Clear();

                        // [0] - average rating 
                        if (AllRatings.Count > 0)
                        {
                            var avg = AllRatings.Average(r => r.Rate);
                            item.Ratings.Add(new ItemRating() { Id = -1, ItemId = item.Id, Rate = (int)avg });
                        }
                        else
                        {
                            ItemRating rate = new ItemRating() { Id = -1, ItemId = item.Id, Rate = 0 };
                            item.Ratings.Add(rate);
                        }

                        // [1] - user rating, undefined if not logined
                        if (UserId != null)
                        {
                            var rate = AllRatings.Where(r => r.UserId == UserId);
                            if (rate.Any())
                            {
                                item.Ratings.Add(rate.First());
                            }
                            else
                            {
                                item.Ratings.Add(new ItemRating() {
                                    Id = 0,
                                    ItemId = item.Id,
                                    UserId = UserId,
                                    Rate = 0,
                                    Date = DateTime.Today
                                });
                            }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Gets menu on week begin from StartDate. 
        /// GET: api/Menus
        /// </summary>
        /// <param name="MenuMode"></param>
        /// <param name="StartDate">return menu from this date</param>
        /// <returns>Menu on week</returns>
        public List<Menu> GetMenus(string MenuMode = "normal", DateTime? StartDate = null)
        {
            MenuType get_type = MenuType.NormalMenu;
            List<Menu> result = new List<Menu>();

            if (StartDate == null)
            {
                StartDate = DateTime.Today.AddDays(1 - (int)DateTime.Today.DayOfWeek);
            }

            switch (MenuMode)
            {
                case "none":
                    get_type = MenuType.NoneMenu;
                    result = db.Menus.Include("Items").Where(m => m.Type == get_type).ToList();
                    break;
                case "all":
                    result = db.Menus.Include("Items").Where(m => m.Type == get_type).ToList();
                    break;
                default:
                    result = db.Menus.Include("Items").Include("Items.Ratings")
                            .Where(m => m.Type == get_type && m.OnDate >= StartDate)
                            .ToList();
                            
                    
                    CalculateRatings(result);
                    break;
            }
            return result;
        }


        

        // GET: api/Menus/5
        [ResponseType(typeof(Menu))]
        public IHttpActionResult GetMenu(int id)
        {
            Menu menu = db.Menus.Find(id);
            if (menu == null)
            {
                return NotFound();
            }

            return Ok(menu);
        }

        // PUT: api/Menus/5
        [Authorize(Roles = "Admin, GlobalAdmin")]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutMenu(int id, Menu menu)
        {
            if (menu.Items != null)
            {
                foreach (var item in menu.Items)
                {
                    if (item.Id == 0)
                    {
                        db.Items.Add(item);
                        db.SaveChanges();
                    }
                }
                ModelState.Clear();
               
            }
            

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != menu.Id)
            {
                return BadRequest();
            }

            foreach (var item in menu.Items)
            {
                item.Ratings = null;
                db.Entry(item).State = EntityState.Modified;
            }

            db.Entry(menu).State = EntityState.Modified;
            
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MenuExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Menus
        [Authorize(Roles = "Admin, GlobalAdmin")]
        [ResponseType(typeof(Menu))]
        public IHttpActionResult PostMenu(Menu menu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Menus.Add(menu);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = menu.Id }, menu);
        }

        // DELETE: api/Menus/5
        [Authorize(Roles = "Admin, GlobalAdmin")]
        [ResponseType(typeof(Menu))]
        public IHttpActionResult DeleteMenu(int id)
        {
            Menu menu = db.Menus.Find(id);
            if (menu == null)
            {
                return NotFound();
            }

            db.Menus.Remove(menu);
            db.SaveChanges();

            return Ok(menu);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MenuExists(int id)
        {
            return db.Menus.Count(e => e.Id == id) > 0;
        }

        

    }
}