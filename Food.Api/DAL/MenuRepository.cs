using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using Food.Api.Models;


namespace Food.Api.DAL
{ 
    public class MenuRepository : GenericRepository<Menu>, IMenuRepository
    {
        public void DoSomething()
        {
            throw new NotImplementedException();
        }

        //TODO: Rewrite to SQL/Linq query
        private void CalculateRatings(List<Menu> menus, string UserId)
        {
            foreach (var menu in menus)
            {
                menu.Items = menu.Items.OrderBy(i => i.Order).ToList();
                foreach (var item in menu.Items)
                {
                    // if ratings not calculated (present raiting with id = -1)
                    if (!item.Ratings.Where(ir => ir.Id < 0).Any())
                    {
                        var AllRatings = item.Ratings.ToList();
                        item.Ratings.Clear();

                        // [0] - average rating 
                        if (AllRatings.Count > 0)
                        {
                            var avg = AllRatings.Average(r => r.Rate);
                            item.Ratings.Add(new ItemRating() { Id = -1, ItemId = item.Id, Rate = (int)avg });
                        }
                        else
                        {
                            ItemRating rate = new ItemRating() { Id = -1, ItemId = item.Id, Rate = 0 };
                            item.Ratings.Add(rate);
                        }

                        // [1] - user rating, undefined if not logined
                        if (UserId != null)
                        {
                            var rate = AllRatings.Where(r => r.UserId == UserId);
                            if (rate.Any())
                            {
                                item.Ratings.Add(rate.First());
                            }
                            else
                            {
                                item.Ratings.Add(new ItemRating()
                                {
                                    Id = 0,
                                    ItemId = item.Id,
                                    UserId = UserId,
                                    Rate = 0,
                                    Date = DateTime.Today
                                });
                            }
                        }
                    }
                }
            }
        }

        public override Menu Find(object id)
        {
            if (id == null)
            {
                throw new NullReferenceException();
            }
            return table.Include("Items").SingleOrDefault(m => m.Id == (int)id);
        }
    }

    public interface IMenuRepository: IGenericRepository<Menu>
    {
        void DoSomething();
    }
    
}