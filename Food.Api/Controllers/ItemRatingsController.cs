using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Food.Api.DAL;
using Food.Api.Models;
using Microsoft.AspNet.Identity;

namespace Food.Api.Controllers
{
    public class ItemRatingsController : ApiController
    {
        private FoodDBContext db = new FoodDBContext();
        

    
    
        // GET: api/ItemRatings
        public IQueryable<ItemRating> GetItemRatings()
        {
            return db.ItemRatings;
        }

        // GET: api/ItemRatings/5
        [ResponseType(typeof(ItemRating))]
        public async Task<IHttpActionResult> GetItemRating(int id)
        {
            ItemRating itemRating = await db.ItemRatings.FindAsync(id);
            if (itemRating == null)
            {
                return NotFound();
            }

            return Ok(itemRating);
        }

        // PUT: api/ItemRatings/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutItemRating(int id, ItemRating itemRating)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != itemRating.Id)
            {
                return BadRequest();
            }

            db.Entry(itemRating).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemRatingExists(id))
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

        // POST: api/ItemRatings
        [ResponseType(typeof(ItemRating))]
        public async Task<IHttpActionResult> PostItemRating(ItemRating itemRating)
        {
            string UserId = User.Identity.GetUserId();

            if (!ModelState.IsValid || itemRating.UserId != UserId)
            {
                return BadRequest(ModelState);
            }
            
            db.ItemRatings.Add(itemRating);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = itemRating.Id }, itemRating);
        }

        // DELETE: api/ItemRatings/5
        [ResponseType(typeof(ItemRating))]
        public async Task<IHttpActionResult> DeleteItemRating(int id)
        {
            ItemRating itemRating = await db.ItemRatings.FindAsync(id);
            if (itemRating == null)
            {
                return NotFound();
            }

            db.ItemRatings.Remove(itemRating);
            await db.SaveChangesAsync();

            return Ok(itemRating);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ItemRatingExists(int id)
        {
            return db.ItemRatings.Count(e => e.Id == id) > 0;
        }
    }
}