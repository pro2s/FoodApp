using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Food.Api.DAL
{
    public static class FoodDBExtension
    {
        /// <summary>
        /// Get range of records
        /// </summary>
        /// <typeparam name="T">Any entry</typeparam>
        /// <param name="query">Self query parametr</param>
        /// <param name="total">Count of records</param>
        /// <param name="from">From records</param>
        /// <param name="to">To records</param>
        /// <returns>Range of query records</returns>
        public static IQueryable<T> Range<T>(this IQueryable<T> query, int total, int from, int to )
        {
            int count = to - from + 1;
            if (count > 0 && from < total)
            {
                query = query.Skip(from).Take(count);
            }
            return query;
        }

    }
}