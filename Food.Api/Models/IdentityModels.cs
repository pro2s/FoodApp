using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using System.Data.Entity;

namespace Food.Api.Models
{
    // Чтобы добавить данные профиля для пользователя, можно добавить дополнительные свойства в класс ApplicationUser. Дополнительные сведения см. по адресу: http://go.microsoft.com/fwlink/?LinkID=317594.
    public class ApplicationUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType)
        {
            // Обратите внимание, что authenticationType должен совпадать с типом, определенным в CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Здесь добавьте настраиваемые утверждения пользователя
            return userIdentity;
        }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
            Database.SetInitializer<ApplicationDbContext>(new ApplicationDbContextInitializer());
        }
        
        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }

    public class ApplicationDbContextInitializer : CreateDatabaseIfNotExists<ApplicationDbContext>
    {
        protected override void Seed(ApplicationDbContext context)
        {
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

            var Admin = new ApplicationUser {
                UserName = "Admin",
                Email = "admin@admin",
                EmailConfirmed = true,
            };

            var result = UserManager.Create(Admin, "Admin@12345");
            
            if (result.Succeeded)
            {
                UserManager.AddToRole(Admin.Id, "GlobalAdmin");
                UserManager.AddToRole(Admin.Id, "Admin");
            }

            context.SaveChanges();

            base.Seed(context);
        }
    }

}