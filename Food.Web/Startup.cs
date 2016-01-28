using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Food.Web.Startup))]
namespace Food.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
