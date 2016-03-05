using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using Food.Api.Models;

namespace Food.Api.DAL
{ 
    public class MenuRepository : IMenuRepository
    {
        FoodDBContext context = new FoodDBContext();

        public IQueryable<Menu> All
        {
            get { return context.Menus; }
        }

        public IQueryable<Menu> AllIncluding(params Expression<Func<Menu, object>>[] includeProperties)
        {
            IQueryable<Menu> query = context.Menus;
            foreach (var includeProperty in includeProperties) {
                query = query.Include(includeProperty);
            }
            return query;
        }

        public Menu Find(int id)
        {
            return context.Menus.Find(id);
        }

        public void InsertOrUpdate(Menu menu)
        {
            if (menu.Id == default(int)) {
                // New entity
                context.Menus.Add(menu);
            } else {
                // Existing entity
                context.Entry(menu).State = EntityState.Modified;
            }
        }

        public void Delete(int id)
        {
            var menu = context.Menus.Find(id);
            context.Menus.Remove(menu);
        }

        public void Save()
        {
            context.SaveChanges();
        }

        public void Dispose() 
        {
            context.Dispose();
        }
    }

    public interface IMenuRepository : IDisposable
    {
        IQueryable<Menu> All { get; }
        IQueryable<Menu> AllIncluding(params Expression<Func<Menu, object>>[] includeProperties);
        Menu Find(int id);
        void InsertOrUpdate(Menu menu);
        void Delete(int id);
        void Save();
    }
}