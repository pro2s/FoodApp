﻿using HtmlAgilityPack;
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
    public interface IMenuParser
    {
        List<Menu> ParseMenu();
        Dictionary<string,string> GetInfo();
    }

    public class ChudoPechkaHtml : ChudoPechka, IMenuParser
    {
        public Dictionary<string, string> GetInfo()
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            result["id"] = "chudopechkahtml";
            result["name"] = "Chudo-Pechka HTML";
            result["icon"] = "http://chudo-pechka.by/assets/templates/Chudopechka/images/logo.png";
            return result;
        }
        
        public List<Menu> ParseMenu()
        {
            ParseHtml();
            return _weekmenu;
        }


        /// <summary>
        /// Load and parse menu from html page
        /// </summary>
        public void ParseHtml()
        {
            Init();
            int day = 0;

            foreach (var item in _html_menu)
            {
                List<Item> items = new List<Item>();
                try
                {
                    var menu_items = item.Element("div");
                    menu_items.InnerHtml = menu_items.InnerHtml.Replace("<br>", "\n");

                    string result = HttpUtility.HtmlDecode(menu_items.InnerText);

                    // Regex for "<name>, <weight>(0-9,/,space)" or "<name>"
                    // @"((?<name>[^\n]+),(?<weight>[\s0-9/]+)([^\n]+))|(?<name>[^\n]+)"

                    // TODO: move Regex to config for service
                    var matches = Regex.Matches(result, @"(?<name>[^\n]+),(?<weight>[\s0-9/]+)([^\n]+)");
                    int order = 0;
                    foreach (Match m in matches)
                    {
                        Item menu_item = new Item();
                        menu_item.Order = order;
                        menu_item.Name = m.Groups["name"].Value.Trim();
                        menu_item.Weight = m.Groups["weight"].Value.Trim();
                        items.Add(menu_item);
                        order++;
                    }

                }
                catch
                {
                    throw new ArgumentException();
                }

                FillMenu(items, day);

                ++day;
                if (day > 4) break;
            }
        }
    }

    public class ChudoPechkaWord : ChudoPechka, IMenuParser
    {
        public Dictionary<string, string> GetInfo()
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            result["id"] = "chudopechkaword";
            result["name"] = "Chudo-Pechka Word";
            result["icon"] = "http://chudo-pechka.by/assets/templates/Chudopechka/images/logo.png";
            result["file"] = _url_menu;

            return result;
        }

        public List<Menu> ParseMenu()
        {
            ParseDoc();
            return _weekmenu;
        }

        protected string GetText(Word.Cell cell)
        {
            string s = cell.Range.Text;
            s = Regex.Replace(s, @"\t|\n|\r|\a", "");
            return s;
        }

        /// <summary>
        /// Load and parse menu from .doc file
        /// </summary>
        public void ParseDoc()
        {
            Init();

            WebClient client = new WebClient();

            string tempfile = Path.GetTempFileName();

            client.DownloadFile(_url + _url_menu, tempfile);
            var wordApp = new Word.Application();
            Word.Document doc = wordApp.Documents.Open(tempfile);

            int day = 0;
            int order = 0;
            List<Item> items = new List<Item>();

            foreach (Word.Table table in doc.Tables)
            {
                for (int row = 1; row <= table.Rows.Count; row++)
                {
                    order = 0;
                    if (table.Rows[row].Cells.Count == 2)
                    {
                        Item item = new Item();
                        item.Order = order;
                        item.Name = GetText(table.Cell(row, 1));
                        item.Weight = GetText(table.Cell(row, 2));
                        var matches = Regex.Matches(item.Name, "(.*?)/(.*?)/");
                        if (matches.Count == 1)
                        {
                            item.Name = matches[0].Groups[1].Value;
                            item.Parts = matches[0].Groups[2].Value;
                        }
                        items.Add(item);
                        order++;
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

            ((Word._Application)wordApp).Quit();
        }
    }


    /// <summary>
    /// Service for parsing menu from site chudo-pechka.by
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
            _monday = DateTime.Today.AddDays(1-(int)DateTime.Today.DayOfWeek);
            _weekmenu = new List<Menu>();
            ReadData();
        }

        protected void Init()
        {
            _weekmenu.Clear();
        }

        
     
        protected void FillMenu(List<Item> items, int day)
        {
            // TODO: get template for menu from DB
            Menu daymenu = new Menu()
            {
                Name = "Полный обед",
                Price = 35000,
                Items = items,
                OnDate = _monday.AddDays(day),
                Type = MenuType.NormalMenu,
            };
            
            _weekmenu.Add(daymenu);

            List<Item> copy_items = new List<Item>();
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

            _weekmenu.Add(daymenu);
        }
        
    }
}