using System;
using System.Collections.Generic;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Food.Api.Models
{
    // Модели, возвращаемые действиями AccountController.

    public class ExternalLoginViewModel
    {
        public string Name { get; set; }

        public string Url { get; set; }

        public string State { get; set; }
    }

    public class ManageInfoViewModel
    {
        public string LocalLoginProvider { get; set; }

        public string Email { get; set; }

        public IEnumerable<UserLoginInfoViewModel> Logins { get; set; }

        public IEnumerable<ExternalLoginViewModel> ExternalLoginProviders { get; set; }
    }

    public class UserInfoViewModel
    {
        public string Id { get; set; }

        public List<string> Roles { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public bool IsEmailConfirmed { get; set; }

        public bool HasRegistered { get; set; }

        public string LoginProvider { get; set; }

        public int Balance { get; internal set; }

        public ICollection<IdentityUserClaim> Claims { get; internal set; }
        public DateTime? LockoutEndDate { get; internal set; }
    }

    public class UserLoginInfoViewModel
    {
        public string LoginProvider { get; set; }

        public string ProviderKey { get; set; }
    }


}