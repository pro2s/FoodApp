using Food.Api.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Food.Api.DAL
{
    public class PaymentRepository : IPaymentRepository
    {
        FoodDBContext context = new FoodDBContext();

        public IQueryable<Payment> All
        {
            get { return context.Payments; }
        }

        public IQueryable<Payment> AllIncluding(params Expression<Func<Payment, object>>[] includeProperties)
        {
            IQueryable<Payment> query = context.Payments;
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }
            return query;
        }

        public Payment Find(int id)
        {
            return context.Payments.Find(id);
        }

        public void InsertOrUpdate(Payment payment)
        {
            if (payment.Id == default(int))
            {
                // New entity
                context.Payments.Add(payment);
            }
            else {
                // Existing entity
                context.Entry(payment).State = EntityState.Modified;
            }
        }

        public void Delete(int id)
        {
            var payment = context.Payments.Find(id);
            context.Payments.Remove(payment);
        }

        public void Save()
        {
            context.SaveChanges();
        }

        public void Dispose()
        {
            context.Dispose();
        }

        public int GetUserBalance(string userId)
        {
            return context.GetUserBalance(userId);
        }
    }

    public interface IPaymentRepository : IDisposable
    {
        IQueryable<Payment> All { get; }
        IQueryable<Payment> AllIncluding(params Expression<Func<Payment, object>>[] includeProperties);
        Payment Find(int id);
        void InsertOrUpdate(Payment payment);
        void Delete(int id);
        void Save();
        int GetUserBalance(string userId);
    }
}
