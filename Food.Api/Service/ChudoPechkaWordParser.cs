using Food.Api.Models;
using Spire.Doc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;

namespace Food.Api
{

    /// <summary>
    /// Get menu from doc file placed on chudo-pechka.by
    /// </summary>
    public class ChudoPechkaWordParser : ChudoPechka, IMenuParser
    {
        private Dictionary<string, string> _info;

        public ChudoPechkaWordParser() : base()
        {
            _info = new Dictionary<string, string>();
            _info["id"] = "chudopechkaword";
            _info["name"] = "Chudo-Pechka Word";
            _info["icon"] = "http://chudo-pechka.by/assets/templates/Chudopechka/images/logo.png";
            String url_menu = _url_menu ?? "";
            _info["info"] = Uri.UnescapeDataString(url_menu.Substring(url_menu.LastIndexOf('/') + 1));
        }

        public string Id()
        {
            return _info["id"];
        }

        public Dictionary<string, string> GetInfo()
        {
            return _info;
        }

        public List<Menu> ParseMenu(DateTime? start = null)
        {
            if (start != null)
            {
                _monday = (DateTime)start;
            }
            
            if (!_error)
            {
                ParseDoc();
            }
            
            return _weekmenu;
        }

        public List<Menu> GetDayMenu()
        {
            List<Item> items = new List<Item>();
            List<Menu> menus = FillMenu(items, 0);
            return menus;
        }

        protected string GetText(string cell)
        {
            string s = Regex.Replace(cell, @"\t|\n|\r|\a", "");
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

            var document = new Document(tempfile, FileFormat.Doc);

            int day = 0;
            List<Item> items = new List<Item>();
            foreach (Section section in document.Sections)
            {
                foreach (Table table in section.Tables)
                {
                    for (int row = 0; row < table.Rows.Count; row++)
                    {
                        if (table.Rows[row].Cells.Count == 2)
                        {
                            var rowData = table.Rows[row].Cells;
                            Item item = new Item();
                             
                            item.Name = GetText(rowData[0].Paragraphs[0].Text);
                            item.Weight = GetText(rowData[1].Paragraphs[0].Text);
                            var matches = Regex.Matches(item.Name, "(.*?)/(.*?)/");
                            if (matches.Count == 1)
                            {
                                item.Name = matches[0].Groups[1].Value;
                                item.Parts = matches[0].Groups[2].Value;
                            }
                            items.Add(item);
                        }
                        else
                        {
                            if (items.Count > 0)
                            {
                                if (day == 0 && items.Count > 1)
                                {
                                    items.RemoveAt(0);
                                }

                                _weekmenu.AddRange(FillMenu(items, day));
                                items.Clear();
                                ++day;
                            }

                        }

                    }
                }
            }
            if (items.Count > 0)
            {
                _weekmenu.AddRange(FillMenu(items, day));
            }
            document.Close();
        }
    }

}