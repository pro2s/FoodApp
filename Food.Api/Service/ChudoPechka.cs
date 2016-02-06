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
   /* 
    public class MenuItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Parts { get; set; }
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
    */
    public class ChudoPechka
    {
        public static Menu NoChoice = new Menu() { Id = -1, Name = "Без Обеда", Price = 0, OnDate = null };
        string _url;
        
        DateTime _monday;
        IEnumerable<HtmlNode> _html_menu;
        string _url_menu;

        private List<Menu> _weekmenu
        {
            get; set;
        }
        
        private void ReadData()
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
            _monday = DateTime.Today.AddDays(1-(int)DateTime.Today.DayOfWeek);
            _weekmenu = new List<Menu>();
            Init();
            ReadData();
        }

        private void Init()
        {
            _weekmenu.Clear();
            _weekmenu.Add(NoChoice);
            List<MenuItem> items = new List<MenuItem>();
            // специальные пункты для следующего понедельника в понедельник после 
            // получения нового меню должны заменятся на вновь добавленные
            FillMenu(items, 7);
        }

        public List<Menu> Get()
        {
            return _weekmenu;
        }

        private string GetText(Word.Cell cell)
        {
            string s = cell.Range.Text;
            s = Regex.Replace(s, @"\t|\n|\r|\a", "");
            return s;
        }

        private void FillMenu(List<MenuItem> items, int day)
        {
            Menu daymenu = new Menu()
            {
                Name = "Полный обед",
                Price = 35000,
                Items = items,
                OnDate = _monday.AddDays(day),
                Type = MenuType.NormalMenu,
            };
            
            _weekmenu.Add(daymenu);
            
            items = new List<MenuItem>(items);
            if (items.Count > 2)
            {
                items.RemoveAt(1);
            }

            daymenu = new Menu()
            {
                Name = "Без первого",
                Price = 30000,
                Items = items,
                OnDate = _monday.AddDays(day),
                Type = MenuType.NormalMenu,
            };

            _weekmenu.Add(daymenu);
        }

        public void LoadDoc()
        {
            Init();
           
            WebClient client = new WebClient();
            
            string tempfile = Path.GetTempFileName();
            
            client.DownloadFile(_url + _url_menu, tempfile);
            var wordApp = new Word.Application();
            Word.Document doc = wordApp.Documents.Open(tempfile);
            
            int day = 0;
            List<MenuItem> items = new List<MenuItem>();

            foreach (Word.Table table in doc.Tables)
            {
                for (int row = 1; row <= table.Rows.Count; row++)
                {
                    if (table.Rows[row].Cells.Count == 2)
                    {
                        MenuItem item = new MenuItem();

                        item.Name = GetText(table.Cell(row, 1));
                        item.Weight = GetText(table.Cell(row, 2));
                        var matches = Regex.Matches(item.Name, "(.*?)/(.*?)/");
                        if (matches.Count == 1)
                        {
                            item.Name = matches[0].Groups[1].Value;
                            item.Parts =  matches[0].Groups[2].Value;
                        }
                        items.Add(item);
                    }
                    else
                    {
                        var text = GetText(table.Cell(row, 1));
                        
                        if (day > 0)
                        {
                            if (day == 1 && items.Count > 1)
                            {
                                items.RemoveAt(0);
                            }

                            FillMenu(items, day);
                        } 
                        
                        items.Clear();
                        ++day;
                    }
                    
                }
            }
            if (items.Count > 0)
            {
                FillMenu(items, day);
            }
            
            ((Word._Application) wordApp).Quit();
        }


        public void Load()
        {
            Init();
            int day = 0;
            
            foreach (var item in _html_menu)
            {
                List<MenuItem> items = new List<MenuItem>();
                try
                {
                    string result = HttpUtility.HtmlDecode(item.Element("div").Element("span").InnerText);
                    var matches = Regex.Matches(result, "(.*?),(.*?)гр");
                    foreach (Match m in matches)
                    {
                        items.Add(
                            new MenuItem()
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

                FillMenu(items, day);
                
                ++day;
                if (day > 5) break;
            }
        }
    }
}