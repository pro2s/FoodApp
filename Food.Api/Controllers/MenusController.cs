﻿using System;
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

        // GET: api/Menus
        /// <summary>
        /// Gets menu on week begin from monday.
        /// </summary>
        public List<Menu> GetMenus(string MenuMode = "normal", DateTime? StartDate = null)
        {
            MenuType get_type = MenuType.NormalMenu;
            if (StartDate == null)
            {
                StartDate = DateTime.Today.AddDays(1 - (int)DateTime.Today.DayOfWeek);
            }
            string UserId = User.Identity.GetUserId();

            var query = db.Menus.Include("Items").Include("Items.Ratings")
                .Where(m => m.Type == get_type && m.OnDate >= StartDate).ToList();

            //TODO: rewrite to sql 
            foreach( var menu in query )
            {
                foreach(var item in menu.Items)
                {
                    var AllRatings = item.Ratings;
                    item.Ratings = new List<ItemRating>();

                    if (UserId != null)
                    {
                        var rate = AllRatings.Where(r => r.UserId == UserId).First();
                        if (rate != null)
                        {
                            item.Ratings.Add(rate);
                        }
                    }
                    var avg = AllRatings.Average( r=> r.Raiting);
                    item.Ratings.Add(new ItemRating() { Id = -1, ItemId = item.Id, Raiting = (int)avg });
                }
            }


            switch (MenuMode)
            {
                case "none":
                    get_type = MenuType.NoneMenu;
                    query = db.Menus.Include("Items").Where(m => m.Type == get_type).ToList();
                    break;
                case "all":
                    query = db.Menus.Include("Items").Where(m => m.Type == get_type).ToList();
                    break;
            }

            return query;
        }


        [Route("api/menus/parse")]
        [HttpGet]
        public string ParseMenu()
        {
            string result = "OK";
            ChudoPechka parser = new ChudoPechka();
            parser.Load();
            List<Menu> menus = parser.Get();
            db.Menus.AddRange(menus);
            db.SaveChanges();
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

        /// <summary>
        /// Return response on OPTION request
        /// </summary>
        /// <returns>Always OK</returns>
        // TODO: Move into BaseApiController
        public HttpResponseMessage Options()
        {
            return new HttpResponseMessage { StatusCode = HttpStatusCode.OK };
        }

    }
}