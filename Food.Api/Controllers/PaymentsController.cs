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

using Microsoft.AspNet.Identity.Owin;
using Food.Api.Atributes;

namespace Food.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/Payments")]
    public class PaymentsController : ApiController
    {
        private FoodDBContext db;

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

        public PaymentsController()
        {
            db = new FoodDBContext();
        }

        // GET: api/Payments
        [EnableRange]
        public List<PaymentViewModel> GetPayments(string list = "user", bool range = false, int from = 0, int to = 0)
        {
            string id = User.Identity.GetUserId();
            IQueryable<Payment> query;
            if (User.IsInRole("Admin") && list == "all")
            {
                query = db.Payments.OrderByDescending(p=>p.Date).ThenByDescending(p => p.Id); 
            }
            else
            {
                query = db.Payments.Where(p => p.UserID == id).OrderByDescending(p => p.Date).ThenByDescending(p=> p.Id); 
            }

            if (range)
            {
                int count = to - from + 1;
                int total = query.Count();
                Request.Headers.Add("X-Range-Total", total.ToString());
                if (count > 0 && from < total)
                {
                    query = query.Skip(from).Take(count);
                }
            }

            var result = query.ToList().Select(p => new PaymentViewModel() {
                Id = p.Id,
                Sum = p.Sum,
                UserId = p.UserID,
                Date = p.Date,
                UserName = UserManager.FindById(p.UserID).UserName,
                });

            return result.ToList();
            
        }

        // GET: api/Payments
        [Route("Sum")]
        public IHttpActionResult GetPaymentsSum()
        {
            string id = User.Identity.GetUserId();
            int sum = db.Payments.Where(uc => uc.UserID == id).Sum(uc => (int?)uc.Sum) ?? 0;
            return Ok(new { Sum = sum });
        }

        // GET: api/Payments/5
        [ResponseType(typeof(Payment))]
        public IHttpActionResult GetPayment(int id)
        {
            Payment payment = db.Payments.Find(id);
            if (payment == null)
            {
                return NotFound();
            }

            return Ok(payment);
        }

        // PUT: api/Payments/5
        [Authorize(Roles = "Admin, GlobalAdmin")]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutPayment(int id, Payment payment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != payment.Id)
            {
                return BadRequest();
            }

            db.Entry(payment).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentExists(id))
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
        /// <summary>
        /// Sharing balance from to other users
        /// </summary>
        /// <param name="Share"></param>
        /// <returns></returns>
        // POST: api/Payments/Share
        [ResponseType(typeof(Payment))]
        [HttpPost]
        [Route("Share", Name="ShareBalance")]
        public IHttpActionResult ShareBalance(ShareToBindingModel Share)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string UserId = User.Identity.GetUserId();
            var ToUser = UserManager.FindByEmail(Share.Email);
            if (ToUser == null)
            {
                ModelState.AddModelError("Share.Email", "User not found.");
                return BadRequest(ModelState);
            }

            int debit = db.Payments.Where(p => p.UserID == UserId).Sum(p => (int?)p.Sum) ?? 0;
            int credit = db.UserChoices.Where(uc => uc.UserID == UserId && uc.confirm).Sum(uc => (int?)uc.Menu.Price) ?? 0;
            if (debit - credit - Share.Amount < 0)
            {
                ModelState.AddModelError("Share.Amount", "Insufficient balance.");
                return BadRequest(ModelState);
            }

            Payment payment_to = new Payment()
            {
                UserID = ToUser.Id,
                Sum = Share.Amount,
                Date = DateTime.UtcNow
            };

            Payment payment_from = new Payment()
            {
                UserID = UserId,
                Sum = -1 * Share.Amount,
                Date = DateTime.UtcNow
            };


            db.Payments.Add(payment_to);
            db.Payments.Add(payment_from);
            db.SaveChanges();

            return CreatedAtRoute("ShareBalance", new { id = payment_from.Id }, payment_from);
        }

        [Authorize(Roles = "Admin, GlobalAdmin")]
        // POST: api/Payments
        [ResponseType(typeof(Payment))]
        public IHttpActionResult PostPayment(Payment payment)
        {
            payment.Date = DateTime.UtcNow;

            Validate(payment);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Payments.Add(payment);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = payment.Id }, payment);
        }

        [Authorize(Roles = "Admin, GlobalAdmin")]
        // DELETE: api/Payments/5
        [ResponseType(typeof(Payment))]
        public IHttpActionResult DeletePayment(int id)
        {
            Payment payment = db.Payments.Find(id);
            if (payment == null)
            {
                return NotFound();
            }

            db.Payments.Remove(payment);
            db.SaveChanges();

            return Ok(payment);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PaymentExists(int id)
        {
            return db.Payments.Count(e => e.Id == id) > 0;
        }
    }
}