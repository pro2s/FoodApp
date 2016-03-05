using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Food.Api.Models;

namespace Food.Api
{
    /// <summary>
    /// Sample menu parser
    /// </summary>
    public class McDonalds : IMenuParser
    {
        private Dictionary<string, string> _info;

        public McDonalds()
        {
            _info = new Dictionary<string, string>();
            _info["id"] = "mcdonalds";
            _info["name"] = "McDonalds";
            _info["icon"] = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald's_Golden_Arches.svg/200px-McDonald's_Golden_Arches.svg.png";
        }

        public string Id()
        {
            return _info["id"];
        }



        /// <summary>
        /// Info about parser
        /// </summary>
        /// <returns>
        /// Dictionary with keys - id, name, icon
        /// </returns>
        public Dictionary<string, string> GetInfo()
        {
            return _info;
        }
        
        /// <summary>
        /// Parse menu from site or file
        /// </summary>
        /// <returns>List of Menu</returns>
        public List<Menu> ParseMenu()
        {
            var menus = new List<Menu>();
            return menus;
        }
    }
}