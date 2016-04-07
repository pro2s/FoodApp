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
        

        public List<Payment> All(out int total, int from = 0, int to = 0) {
            return AllByUser("", out total, from, to);
        } 
        
        public List<Payment> AllByUser(string UserId, out int total, int from = 0, int to = 0)
        {
            IQueryable<Payment> query = context.Payments;

            if (UserId != "")
            {
                query = query.Where(p => p.UserID == UserId);
            }

            query = query.OrderByDescending(p => p.Date).ThenByDescending(p => p.Id);
            total = query.Count();
            if (from != 0 || to != 0)
            {
                query = query.Range(total, from, to);
            }
            return query.ToList();
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

        public bool Delete(int id)
        {
            var payment = context.Payments.Find(id);
            if (payment == null)
            {
                return false;
            }
            context.Payments.Remove(payment);
            return true;
        }

        public void Save()
        {
            context.SaveChanges();
        }

        public void Dispose()
        {
            context.Dispose();
        }

        public int GetUserBalance(string UserId)
        {
            return context.GetUserBalance(UserId);
        }

        public int SumByUser(string UserId)
        {
            return context.Payments.Where(uc => uc.UserID == UserId).Sum(uc => (int?)uc.Sum) ?? 0;
        }

    }

    public interface IPaymentRepository : IDisposable
    {
        List<Payment> All(out int total, int from = 0, int count = 0);
        List<Payment> AllByUser(string UserId, out int total, int from = 0, int count = 0);
        IQueryable<Payment> AllIncluding(params Expression<Func<Payment, object>>[] includeProperties);
        Payment Find(int id);
        void InsertOrUpdate(Payment payment);
        bool Delete(int id);
        void Save();
        int GetUserBalance(string UserId);
        int SumByUser(string UserId);
    }
}
