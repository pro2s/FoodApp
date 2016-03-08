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
    [Authorize]
    public class UserChoicesController : ApiController
    {
        private FoodDBContext db = new FoodDBContext();

        // GET: api/UserChoices
        public IQueryable<UserChoice> GetUserChoices(string list = "user", DateTime? startdate = null)
        {
            DateTime monday = DateTime.Today.AddDays(1 - (int)DateTime.Today.DayOfWeek);
            string id = User.Identity.GetUserId();
            IQueryable <UserChoice> query = db.UserChoices.Include("Menu").Where(uc => uc.UserID == id && uc.date >= monday);
            switch (list)
            {
                case "all":
                    if (User.IsInRole("Admin") || User.IsInRole("GlobalAdmin"))
                    {
                        // TODO: return userchoices for admin organisation
                        query = db.UserChoices.Where(uc => uc.date >= monday);
                    }
                    break;
                case "week":
                    if (User.IsInRole("Admin") || User.IsInRole("GlobalAdmin"))
                    {
                        // TODO: return userchoices for admin organisation
                        query = db.UserChoices.Include("Menu").Where(uc => uc.date >= monday);
                    }
                    break;
                case "personal":
                    query = db.UserChoices.Include("Menu").Where(uc => uc.UserID == id);
                    break;
            }

            return query;
            
        }

        // GET: api/UserChoices/5
        [ResponseType(typeof(UserChoice))]
        public IHttpActionResult GetUserChoice(int id)
        {
            UserChoice userChoice = db.UserChoices.Find(id);
            if (userChoice == null)
            {
                return NotFound();
            }

            return Ok(userChoice);
        }

        // PUT: api/UserChoices/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUserChoice(int id, UserChoice userChoice)
        {
            if (!ModelState.IsValid || id != userChoice.Id)
            {
                return BadRequest(ModelState);
            }
            userChoice.Menu = null;
            db.Entry(userChoice).State = EntityState.Modified;

            if (!CheckUserChoise(userChoice))
            {
                return BadRequest(ModelState);
            }

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserChoiceExists(id))
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

        private bool CheckUserChoise(UserChoice userChoice)
        {
            bool result = true;
            UserChoice oldChoice = db.UserChoices.Where(uc => uc.Id == userChoice.Id).First();
            Menu menu = db.Menus.First(m => m.Id == userChoice.MenuId);
            int balance = db.GetUserBalance(userChoice.UserID);

            if (User.IsInRole("Admin") || User.IsInRole("GlobalAdmin"))
            {
                if (userChoice.confirm && !oldChoice.confirm)
                {
                    balance = balance - menu.Price;
                    if (balance < 0)
                    {
                        result = false;
                    }
                }
            }
            else
            {
                if (userChoice.UserID == User.Identity.GetUserId())
                {
                    if (balance > menu.Price)
                    {
                        result = false;
                    }
                }
                else
                {
                    result = false;
                }
            }

            return result;
        }

        // POST: api/UserChoices
        [ResponseType(typeof(UserChoice))]
        public IHttpActionResult PostUserChoice(UserChoice userChoice)
        {
            if (userChoice.UserID == null)
            {
                userChoice.UserID = User.Identity.GetUserId();
                Validate(userChoice);
            } 

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Menu menu = db.Menus.First(m => m.Id == userChoice.MenuId);
            int balance = db.GetUserBalance(userChoice.UserID);
            if (balance > menu.Price)
            {
                db.UserChoices.Add(userChoice);
                db.SaveChanges();

            }
            else
            {
                return BadRequest(ModelState);
            }

            return CreatedAtRoute("DefaultApi", new { id = userChoice.Id }, userChoice);
        }

        // DELETE: api/UserChoices/5
        [ResponseType(typeof(UserChoice))]
        public IHttpActionResult DeleteUserChoice(int id)
        {
            UserChoice userChoice = db.UserChoices.Find(id);
            if (userChoice == null)
            {
                return NotFound();
            }

            db.UserChoices.Remove(userChoice);
            db.SaveChanges();

            return Ok(userChoice);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserChoiceExists(int id)
        {
            return db.UserChoices.Count(e => e.Id == id) > 0;
        }
    }
}