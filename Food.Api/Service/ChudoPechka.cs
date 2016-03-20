using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using Word = Microsoft.Office.Interop.Word;
using System.IO;
using System.Diagnostics;
using Food.Api.Models;

namespace Food.Api
{
    /// <summary>
    /// Base class for parsing menu from site chudo-pechka.by
    /// Reading page and get raw info - html for menu and link to doc file with menu
    /// </summary>
    public class ChudoPechka
    {
        protected string _url;
        protected DateTime _monday;
        protected IEnumerable<HtmlNode> _html_menu;
        protected string _url_menu;

        protected List<Menu> _weekmenu
        {
            get; set;
        }

        protected void ReadData()
        {
            WebClient client = new WebClient();
            
            var data = client.DownloadData(_url);
            var raw_html = Encoding.UTF8.GetString(data);
            var html = new HtmlDocument();
            html.LoadHtml(raw_html);
            _html_menu = html.GetElementbyId("issues").Elements("li");
            _url_menu = html.DocumentNode.Descendants("a")
                .Where(d => d.Attributes.Contains("class") && d.Attributes["class"].Value.Contains("file but"))
                .First()
                .Attributes["href"].Value;

        }
      
        public ChudoPechka()
        {
            _url = "http://chudo-pechka.by/";
            _monday = DateTime.Today.StartOfWeek();
            _weekmenu = new List<Menu>();
            ReadData();
        }

        protected void Init()
        {
            _weekmenu.Clear();
        }



        protected List<Menu> FillMenu(List<Item> items, int day)
        {
            List<Menu> result = new List<Menu>();
            int order = 0;
            foreach (var item in items)
            {
                item.Order = order;
                order++;
            };

            // TODO: get template for menu from DB

            List<Item> copy_items = new List<Item>();
            copy_items = items.ConvertAll(item => (Item)item.Clone());

            Menu daymenu = new Menu()
            {
                Name = "Полный обед",
                Price = 35000,
                Items = copy_items,
                OnDate = _monday.AddDays(day),
                Type = MenuType.NormalMenu,
            };

            result.Add(daymenu);

            copy_items = new List<Item>();
            copy_items = items.ConvertAll(item => (Item)item.Clone());
            
            if (copy_items.Count > 2)
            {
                copy_items.RemoveAt(1);
            }

            daymenu = new Menu()
            {
                Name = "Без первого",
                Price = 30000,
                Items = copy_items,
                OnDate = _monday.AddDays(day),
                Type = MenuType.NormalMenu,
            };

            result.Add(daymenu);

            return result;
        }
        
    }
}