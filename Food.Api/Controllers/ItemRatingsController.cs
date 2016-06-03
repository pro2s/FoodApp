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
        readonly IGenericRepository<ItemRating> _ratings;

        public ItemRatingsController(IGenericRepository<ItemRating> ratings)
        {
            _ratings = ratings;
        }

        // GET: api/ItemRatings
        public IQueryable<ItemRating> GetItemRatings()
        {
            return _ratings.All;
        }

        // GET: api/ItemRatings/5
        [ResponseType(typeof(ItemRating))]
        public async Task<IHttpActionResult> GetItemRating(int id)
        {
            ItemRating itemRating = await _ratings.FindAsync(id);

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

            string UserId = User.Identity.GetUserId();

            if (!(User.IsInRole("Admin") || User.IsInRole("GlobalAdmin")) && itemRating.UserId != UserId )
            {
                return Unauthorized();
            }
            
            _ratings.InsertOrUpdate(itemRating);

            try
            {
                await _ratings.SaveAsync();
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string UserId = User.Identity.GetUserId();

            if (!(User.IsInRole("Admin") || User.IsInRole("GlobalAdmin")) && itemRating.UserId != UserId)
            {
                return Unauthorized();
            }
            
            _ratings.InsertOrUpdate(itemRating);
            
            await _ratings.SaveAsync();

            return CreatedAtRoute("DefaultApi", new { id = itemRating.Id }, itemRating);
        }

        // DELETE: api/ItemRatings/5
        [Authorize(Roles = "Admin, GlobalAdmin")]
        [ResponseType(typeof(ItemRating))]
        public async Task<IHttpActionResult> DeleteItemRating(int id)
        {
            ItemRating itemRating = await _ratings.FindAsync(id);

            if (itemRating == null)
            {
                return NotFound();
            }

            _ratings.Delete(itemRating);
            await _ratings.SaveAsync();

            return Ok(itemRating);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _ratings.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ItemRatingExists(int id)
        {
            return _ratings.Find(id) != null;
        }
    }
}