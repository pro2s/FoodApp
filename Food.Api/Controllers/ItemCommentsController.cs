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
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity;

namespace Food.Api.Controllers
{
    public class ItemCommentsController : ApiController
    {
        private FoodDBContext db = new FoodDBContext();

        private ApplicationUserManager _userManager;

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        // GET: api/ItemComments
        public IHttpActionResult GetItemComments(int? itemId)
        {
            if (itemId == null)
            {
                return BadRequest("Only for menu items");
            }
            else
            {
                Dictionary<string, ApplicationUser> users = UserManager.Users.ToDictionary(user => user.Id);

                var result = db.ItemComments
                    .Where(ic => ic.ItemId == itemId)
                    .Select(ic => new ItemCommentViewModel()
                    {
                        Id = ic.Id,
                        Date = ic.Date,
                        Text = ic.Text,
                        ItemId = ic.ItemId,
                        UserName = users[ic.UserId].UserName //ic.UserId
                    });

                foreach (var data in result)
                {
                    data.UserName = users[data.UserName].UserName;
                }

                return Ok(result);
            }
            
        }

        // GET: api/ItemComments/5
        [Authorize(Roles = "Admin, GlobalAdmin")]
        [ResponseType(typeof(ItemComment))]
        public async Task<IHttpActionResult> GetItemComment(int id)
        {
            ItemComment itemComment = await db.ItemComments.FindAsync(id);
            if (itemComment == null)
            {
                return NotFound();
            }

            return Ok(itemComment);
        }

        // PUT: api/ItemComments/5
        [Authorize(Roles = "Admin, GlobalAdmin")]
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutItemComment(int id, ItemComment itemComment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != itemComment.Id)
            {
                return BadRequest();
            }

            db.Entry(itemComment).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemCommentExists(id))
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

        // POST: api/ItemComments
        [Authorize]
        [ResponseType(typeof(ItemComment))]
        public async Task<IHttpActionResult> PostItemComment(ItemCommentBindModel itemComment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ItemComment comment = new ItemComment()
            {
                ItemId = itemComment.ItemId,
                Text = itemComment.Text,
                UserId = User.Identity.GetUserId(),
                Date = DateTime.Now,
            };

            db.ItemComments.Add(comment);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = comment.Id }, comment);
        }

        // DELETE: api/ItemComments/5
        [ResponseType(typeof(ItemComment))]
        [Authorize]
        public async Task<IHttpActionResult> DeleteItemComment(int id)
        {
            ItemComment itemComment = await db.ItemComments.FindAsync(id);
            if (itemComment == null)
            {
                return NotFound();
            }

            db.ItemComments.Remove(itemComment);
            await db.SaveChangesAsync();

            return Ok(itemComment);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ItemCommentExists(int id)
        {
            return db.ItemComments.Count(e => e.Id == id) > 0;
        }
    }
}