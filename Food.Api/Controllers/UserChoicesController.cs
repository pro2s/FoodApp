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
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class UserChoicesController : ApiController
    {
        private FoodDBContext db = new FoodDBContext();

        // GET: api/UserChoices
        public IQueryable<UserChoice> GetUserChoices(string list = "user", DateTime? startdate = null)
        {
            DateTime monday = DateTime.Today.AddDays(1 - (int)DateTime.Today.DayOfWeek);
            string id = User.Identity.GetUserId();
            IQueryable <UserChoice> query = db.UserChoices.Where(uc => uc.UserID == id && uc.date >= monday);
            switch (list)
            {
                case "all":
                    if (User.IsInRole("OrgAdmin"))
                    {
                        // TODO: return userchoices for admin organisation
                        query = db.UserChoices.Where(uc => uc.date >= monday);
                    }
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userChoice.Id)
            {
                return BadRequest();
            }

            db.Entry(userChoice).State = EntityState.Modified;

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

        // POST: api/UserChoices
        [ResponseType(typeof(UserChoice))]
        public IHttpActionResult PostUserChoice(UserChoice userChoice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserChoices.Add(userChoice);
            db.SaveChanges();

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