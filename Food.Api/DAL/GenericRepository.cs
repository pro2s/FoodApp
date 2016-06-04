using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Web;

namespace Food.Api.DAL
{
    public abstract class GenericRepository<T> : IGenericRepository<T> where T : class, new()
    {
        FoodDBContext context = new FoodDBContext();
        protected DbSet<T> table = null;
        
        public static object GetDefault(Type type)
        {
            if (type.IsValueType)
            {
                return Activator.CreateInstance(type);
            }
            return null;
        }

        public GenericRepository()
        {
            table = context.Set<T>();
        }


        public IQueryable<T> All
        {
            get
            {
                return table;
            }
        }

        public IQueryable<T> AllIncluding(params Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> query = table;
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }
            return query;
        }

        public void Delete(object id)
        {
            if (id == null)
            {
                throw new NullReferenceException("ID cannot be null");
            }
            T item = table.Find(id);
            table.Remove(item);
        }

        public void Delete(T item)
        {
            table.Remove(item);
        }

        public void Dispose()
        {
            context.Dispose();
        }

        public virtual T Find(object id)
        {
            if (id == null)
            {
                throw new NullReferenceException("ID cannot be null");
            }
            return table.Find(id);
        }

        public virtual async Task<T> FindAsync(object id)
        {
            if (id == null )
            {
                throw new NullReferenceException("ID cannot be null");
            }
            return await table.FindAsync(id);
        }

        public void InsertOrUpdate(T item)
        {
            object Id = item.GetType().GetProperty("Id").GetValue(item, null);
            object Default = GetDefault(Id.GetType());
            if (Id == null || Id.Equals(Default))
            {
                // New entity
                table.Add(item);
            }
            else {
                // Existing entity
                table.Attach(item);
                context.Entry(item).State = EntityState.Modified;
            }
        }

        public void Save()
        {
            context.SaveChanges();
        }

        public async Task SaveAsync()
        {
            await context.SaveChangesAsync();
        }

    }



    public interface IGenericRepository<T> : IDisposable where T : class
    {

        IQueryable<T> All { get; }
        IQueryable<T> AllIncluding(params Expression<Func<T, object>>[] includeProperties);
        T Find(object id);
        Task<T> FindAsync(object id);
        void InsertOrUpdate(T obj);
        void Delete(object id);
        void Delete(T item);
        void Save();
        Task SaveAsync();
    }
}