using System;
using System.Collections.Generic;

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
        public List<string> Roles { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public bool IsEmailConfirmed { get; set; }

        public bool HasRegistered { get; set; }

        public string LoginProvider { get; set; }

    }

    public class UserLoginInfoViewModel
    {
        public string LoginProvider { get; set; }

        public string ProviderKey { get; set; }
    }
    
    /// <summary>
    /// Temporaly view model for users list
    /// </summary>
    public class UsersViewModel
    {

        public string Id { get; set; }

        public string Name { get; set; }

        public int Bill { get; set; }
    }
}
