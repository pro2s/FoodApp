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
        readonly IPaymentRepository _payments;

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

        public PaymentsController(IPaymentRepository payments)
        {
            _payments = payments;
        }

        // GET: api/Payments
        [EnableRange]
        public List<PaymentViewModel> GetPayments(string list = "user", bool range = false, int from = 0, int to = 0)
        {
            string id = User.Identity.GetUserId();
            List<Payment> data;
            int total;

            if (User.IsInRole("Admin") && list == "all")
            {
                data = _payments.All(out total, from, to);
            }
            else
            {
                data = _payments.AllByUser(id, out total, from, to);
            }
            

            if (range)
            {
                Request.Headers.Add("X-Range-Total", total.ToString());
            }
            
            var result = data.Select(p => new PaymentViewModel() {
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
            int sum = _payments.SumByUser(id);
            return Ok(new { Sum = sum });
        }

        // GET: api/Payments/5
        [ResponseType(typeof(Payment))]
        public IHttpActionResult GetPayment(int id)
        {
            Payment payment = _payments.Find(id);
            
            if (payment == null)
            {
                return NotFound();
            }

            if (!User.IsInRole("Admin") && payment.UserID != User.Identity.GetUserId())
            {
                return Unauthorized();
            }

            return Ok(payment);
        }

        // PUT: api/Payments/5
        [Authorize(Roles = "Admin, GlobalAdmin")]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutPayment(int id, Payment payment)
        {
            if (payment == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != payment.Id)
            {
                return BadRequest();
            }

            _payments.InsertOrUpdate(payment);
            _payments.Save();

            return CreatedAtRoute("DefaultApi", new { id = payment.Id }, payment);
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

            decimal balance = _payments.GetUserBalance(UserId);

            if (balance - Share.Amount < 0)
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


            _payments.InsertOrUpdate(payment_to);
            _payments.InsertOrUpdate(payment_from);
            _payments.Save();

            return CreatedAtRoute("ShareBalance", new { id = payment_from.Id }, payment_from);
        }
        
        // POST: api/Payments
        [Authorize(Roles = "Admin, GlobalAdmin")]
        [ResponseType(typeof(Payment))]
        public IHttpActionResult PostPayment(Payment payment)
        {
            if (payment == null)
            {
                return BadRequest(ModelState);
            }

            payment.Id = 0;
            payment.Date = DateTime.UtcNow;

            return PutPayment(0, payment);
        }

        // DELETE: api/Payments/5
        [Authorize(Roles = "Admin, GlobalAdmin")]
        [ResponseType(typeof(Payment))]
        public IHttpActionResult DeletePayment(int id)
        {
            if (_payments.Delete(id))
            {
                _payments.Save();
            }
            else
            {
                return NotFound();
            }

            return Ok();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _payments.Dispose();
            }
            base.Dispose(disposing);
        }

    }
}