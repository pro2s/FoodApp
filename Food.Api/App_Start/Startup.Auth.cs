using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Facebook;
using Microsoft.Owin.Security.Google;
using Microsoft.Owin.Security.OAuth;
using Owin;
using Food.Api.Providers;
using Food.Api.Models;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Net.Http;

namespace Food.Api
{   
    public class FacebookBackChannelHandler : HttpClientHandler
    {
        protected override async System.Threading.Tasks.Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            // Replace the RequestUri so it's not malformed
            if (!request.RequestUri.AbsolutePath.Contains("/oauth"))
            {
                request.RequestUri = new Uri(request.RequestUri.AbsoluteUri.Replace("?access_token", "&access_token"));
            }

            return await base.SendAsync(request, cancellationToken);
        }
    }

    public partial class Startup
    {
    
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public static string PublicClientId { get; private set; }

        // Дополнительные сведения о настройке аутентификации см. по адресу: http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Настройка контекста базы данных и диспетчера пользователей для использования одного экземпляра на запрос
            app.CreatePerOwinContext(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);

            // Включение использования файла cookie, в котором приложение может хранить информацию для пользователя, выполнившего вход,
            // и использование файла cookie для временного хранения информации о входах пользователя с помощью стороннего поставщика входа
            app.UseCookieAuthentication(new CookieAuthenticationOptions());
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Настройка приложения для потока обработки на основе OAuth
            PublicClientId = "self";
            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/Token"),
                Provider = new ApplicationOAuthProvider(PublicClientId),
                AuthorizeEndpointPath = new PathString("/api/Account/ExternalLogin"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
                // В рабочем режиме задайте AllowInsecureHttp = false
                AllowInsecureHttp = true
            };

            // Включение использования приложением маркера-носителя для аутентификации пользователей
            app.UseOAuthBearerTokens(OAuthOptions);

            // Раскомментируйте приведенные далее строки, чтобы включить вход с помощью сторонних поставщиков входа
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //    consumerKey: "",
            //    consumerSecret: "");
 

            var options = new FacebookAuthenticationOptions
            {
                AppId = "1022668231126476",
                AppSecret = "c46522637e6190a19352a7cc49ff17cf",
                BackchannelHttpHandler = new FacebookBackChannelHandler(),
                UserInformationEndpoint = "https://graph.facebook.com/v2.4/me?fields=id,name,email",
            };
            options.Scope.Add("email");
            app.UseFacebookAuthentication(options);
        
            app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
            {
                ClientId = "354271380179-ij0k2ijlg5gq2jlg492ppgf77m502lg0.apps.googleusercontent.com",
                ClientSecret = "ClOTRO7isHvu6d5HfRfkQX2c"
            });


            // Настройка ролей
            // TODO?: move to IdentityModels in Initializer
            ApplicationDbContext context = new ApplicationDbContext();

            UserManager<ApplicationUser> UserManager =
                new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
            RoleManager<IdentityRole> RoleManager =
                new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            
            if (!RoleManager.RoleExists("Admin"))
            {
                var role = new IdentityRole();
                role.Name = "Admin";
                RoleManager.Create(role);
            }

            if (!RoleManager.RoleExists("GlobalAdmin"))
            {
                var role = new IdentityRole();
                role.Name = "GlobalAdmin";
                RoleManager.Create(role);
            }

            if (!RoleManager.RoleExists("User"))
            {
                var role = new IdentityRole();
                role.Name = "User";
                RoleManager.Create(role);
            }
            
        }
    }
}
