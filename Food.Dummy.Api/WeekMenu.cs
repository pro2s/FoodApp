using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace Food.Dummy.Api
{
    public class Item
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Weight { get; set; }
    }

    public class Menu
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual List<Item> Items { get; set; }
        public int Price { get; set; }
        public DateTime? OnDate { get; set; }
    }

    public class WeekMenu
    {
      
        private List<Menu> _weekmenu
        {
            get; set;
        }

        public WeekMenu()
        {
            _weekmenu = new List<Menu>();
            Init();
        }

        private void Init()
        {
            _weekmenu.Clear();
            Menu nochoice = new Menu() { Id = -1, Name = "Без Обеда", Price = 0, OnDate = null };
            _weekmenu.Add(nochoice);
        }

        public List<Menu> Get()
        {
            Init();
            Load();
            return _weekmenu;
        }

        public void Load()
        {
           
            DateTime MondayDay = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek + 1);
            

            WebClient client = new WebClient();
            var data = client.DownloadData("http://chudo-pechka.by/");
            var raw_html = Encoding.UTF8.GetString(data);
            var html = new HtmlDocument();
            html.LoadHtml(raw_html);
            var html_menu = html.GetElementbyId("issues").Elements("li");
            

            int num = 0;
            int id = new Random().Next() + 1;
            foreach (var item in html_menu)
            {
                List<Item> items = new List<Item>();
                try
                {
                    string result = HttpUtility.HtmlDecode(item.Element("div").Element("span").InnerText);
                    var matches = Regex.Matches(result, "(.*?),(.*?)гр");
                    foreach (Match m in matches)
                    {
                        items.Add(
                            new Item()
                            {
                                Name = m.Groups[1].Value.Trim(),
                                Weight = m.Groups[2].Value.Trim()
                            }
                        );
                    }

                }
                catch
                {

                }
                List<int> price = new List<int>();
                try
                {
                    var childs = item.Element("div").Descendants("span");
                    bool start = false;
                    foreach (var child in childs)
                    {
                        if (child.GetAttributeValue("style", "").Contains("Intro"))
                        {
                            start = true;
                        }
                        if (start)
                        {
                            price.Add(int.Parse(Regex.Replace(child.InnerText, @"[^0-9]+", "")));
                        }
                    }
                }
                catch
                {

                }

                if (price.Count == 0)
                {
                    price = new List<int>() { 0, 0 };
                }

                List<Item> menu_ws = new List<Item>();

                if (items.Count > 0)
                {
                    _weekmenu.Add(new Menu() { Id = id, Items = items, Name = "Полный обед", Price = price[0], OnDate = MondayDay.AddDays(num) });
                    if (items.Count > 2)
                    {
                        items = new List<Item>(items);
                        items.RemoveAt(1);
                        _weekmenu.Add(new Menu() { Id = ++id, Items = items, Name = "Без первого", Price = price[1], OnDate = MondayDay.AddDays(num) });
                    }
                }

                ++num;
                if (num > 4) break;
            }
        }
    }
}