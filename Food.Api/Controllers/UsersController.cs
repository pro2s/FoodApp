﻿using Food.Api.Atributes;
using Food.Api.DAL;
using Food.Api.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace Food.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/Users")]
    public class UsersController : ApiController
    {
        private ApplicationUserManager _userManager;
        private IPaymentRepository _payments;

        public UsersController()
        {
        }

        public UsersController(IPaymentRepository payments)
        {
            _payments = payments;
        }

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

        /// <summary>
        /// Get users info
        /// </summary>
        /// <returns>List users</returns>
        // POST api/Users
        [EnableRange]
        [Authorize(Roles = "Admin, GlobalAdmin")]
        [Route("~/api/Users")]
        [ResponseType(typeof(List<UserInfoViewModel>))]
        public List<UserInfoViewModel> GetUsers(bool range = false, int from = 0, int to = 0)
        {
            List<UserInfoViewModel> result = new List<UserInfoViewModel>();
            IQueryable<ApplicationUser> users = UserManager.Users.OrderBy(u=>u.Id);
            
            if (range)
            {
                int count = to - from + 1;
                int total = users.Count();
                Request.Headers.Add("X-Range-Total", total.ToString());
                if (count > 0 && from < total)
                {
                    users = users.Skip(from).Take(count);
                }
            }

            foreach (var user in users.ToList())
            {
                result.Add(FillUserInfo(user));
            }

            return result;
        }

        /// <summary>
        /// Get user info
        /// </summary>
        /// <returns>user info</returns>
        // POST api/Users
        [Authorize(Roles = "Admin, GlobalAdmin")]
        [Route("~/api/Users/{id}")]
        [ResponseType(typeof(UserInfoViewModel))]
        public IHttpActionResult GetUser(string id)
        {
            var user = UserManager.FindById(id);

            if (user == null)
            {
                return NotFound();
            }

            UserInfoViewModel result = FillUserInfo(user);

            return Ok(result);
        }

        private UserInfoViewModel FillUserInfo(ApplicationUser user)
        {
         
            return new UserInfoViewModel()
            {
                Id = user.Id,
                UserName = user.UserName,
                Roles = UserManager.GetRoles(user.Id).ToList(),
                Email = user.Email,
                IsEmailConfirmed = user.EmailConfirmed,
                Balance = _payments.GetUserBalance(user.Id),
                HasRegistered = true,
                Claims = user.Claims,
                LockoutEndDate = user.LockoutEndDateUtc,
            };
        }

    }
}
