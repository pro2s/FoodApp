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

        string _url = "http://chudo-pechka.by/";

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

        private HtmlDocument ReadData()
        {
            WebClient client = new WebClient();
            
            var data = client.DownloadData(_url);
            var raw_html = Encoding.UTF8.GetString(data);
            var html = new HtmlDocument();
            html.LoadHtml(raw_html);
            return html;
        }

        public void LoadDoc()
        {
            HtmlDocument html = ReadData();
            var doc_url = html.DocumentNode.Descendants("a").Where(d =>
                d.Attributes.Contains("class") && d.Attributes["class"].Value.Contains("file but")
                ).First().Attributes["href"];
            WebClient client = new WebClient();
            
            string tempfile = Path.GetTempFileName();
            
            client.DownloadFile(_url + doc_url.Value, tempfile);
            var wordApp = new Word.Application();
            Word.Document doc = wordApp.Documents.Open(tempfile);
            foreach (Word.Table table in doc.Tables)
            {
                for (int row = 1; row <= table.Rows.Count; row++)
                {
                    if (table.Rows[row].Cells.Count == 2)
                    {
                        var cell = table.Cell(row, 1);
                        var cell2 = table.Cell(row, 2);
                        Debug.WriteLine("{0} - {1}", cell, cell2);
                    }
                    else
                    {

                    }
                    
                }
            }
        }


        public void Load()
        {
            DateTime MondayDay = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek + 1);
            HtmlDocument html = ReadData();

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

                List<int> price = new List<int>() { 35000, 30000 };
                
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