﻿using System;
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
using Food.Api.Atributes;

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
        [EnableRange]
        public IHttpActionResult GetItemComments(int? itemId, bool range = false, int from = 0, int to = 0)
        {
            if (itemId == null)
            {
                return BadRequest("Only for menu items");
            }
            else
            {
                Dictionary<string, ApplicationUser> users = UserManager.Users.ToDictionary(user => user.Id);
                var query = db.ItemComments
                    .Where(ic => ic.ItemId == itemId)
                    .Select(ic => new ItemCommentViewModel()
                    {
                        Id = ic.Id,
                        Date = ic.Date,
                        Text = ic.Text,
                        ItemId = ic.ItemId,
                        UserName = ic.UserId
                    })
                    .OrderByDescending(ic => ic.Date);

                int total = query.Count();
                
                Request.Headers.Add("X-Range-Total", total.ToString());
                
                List<ItemCommentViewModel> result;
                if (range) {
                    int count = to - from + 1;
                    var range_query = query.Skip(from).Take(count);
                    result = range_query.ToList();
                }
                else
                {
                    result = query.ToList();
                }

                

                if(result != null)
                {
                    foreach (var data in result)
                    {
                        data.UserName = users[data.UserName].UserName;
                    }
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

            string UserId = User.Identity.GetUserId();
            var claims = await UserManager.GetClaimsAsync(UserId);
            
            bool ReadonlyComments = claims.Where(c => c.Type == "comments" && c.Value == "readonly").Any();
            if (ReadonlyComments)
            {
                return BadRequest("You may only read.");
            }

            ItemComment comment = new ItemComment()
            {
                ItemId = itemComment.ItemId,
                Text = itemComment.Text,
                UserId = UserId,
                Date = DateTime.UtcNow,
            };

            db.ItemComments.Add(comment);
            await db.SaveChangesAsync();

            var commentView = new ItemCommentViewModel()
            {
                Id = comment.Id,
                ItemId = comment.ItemId,
                Date = comment.Date,
                Text = comment.Text,
                UserName = UserManager.FindById(comment.UserId).UserName,
            };

            return CreatedAtRoute("DefaultApi", new { id = comment.Id }, commentView);
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