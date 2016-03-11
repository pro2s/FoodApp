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
using Pysco68.Owin.Authentication.Ntlm;
using System.Configuration;

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
            //app.UseCookieAuthentication(new CookieAuthenticationOptions());
            app.UseCookieAuthentication(new CookieAuthenticationOptions()
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/api/account/ntlmlogin"),
                Provider = new CookieAuthenticationProvider()
                {
                    OnApplyRedirect = ctx =>
                    {
                        if (!ctx.Request.IsNtlmAuthenticationCallback())    // <------
                        {
                            ctx.Response.Redirect(ctx.RedirectUri);
                        }
                    }
                }
            });

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
                AppId = ConfigurationManager.AppSettings["FACEBOOK_ID"], 
                AppSecret = ConfigurationManager.AppSettings["FACEBOOK_SECRET"], 
                BackchannelHttpHandler = new FacebookBackChannelHandler(),
                UserInformationEndpoint = "https://graph.facebook.com/v2.4/me?fields=id,name,email",
            };
            options.Scope.Add("email");
            app.UseFacebookAuthentication(options);
        
            app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
            {
                ClientId = ConfigurationManager.AppSettings["GOOGLE_ID"],
                ClientSecret = ConfigurationManager.AppSettings["GOOGLE_SECRET"],
            });

            // NTLM Auth
            app.UseNtlmAuthentication();


        }
    }
}
