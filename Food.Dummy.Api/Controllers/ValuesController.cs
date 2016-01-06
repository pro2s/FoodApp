using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Mvc;

namespace Food.Dummy.Api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ValuesController : ApiController
    {


        public class UserDay
        {
            public int Id { get; set; }
            public int UserId { get; set; }
            public DateTime Date { get; set; }
            public Choice select { get; set; }
        }

        public class Week
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public virtual List<UserDay> Days { get; set; }
            public virtual List<Choice> ChoiceSet { get; set; }
        }

        public class Choice
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public virtual List<Item> Menu { get; set; }
            public int Price { get; set; }
            public DateTime? OnDate { get; set; }
        }

        public class Item
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Weight { get; set; }
        }

        public Week Get()
        {
            Choice nochoice = new Choice() { Id = 0, Name = "Без Обеда", Price = 0, OnDate = null };
            DateTime MondayDay = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek + 1);
            List<Choice> choice = new List<Choice>()
            {
                nochoice
            };

            WebClient client = new WebClient();
            var data = client.DownloadData("http://chudo-pechka.by/");
            var raw_html = Encoding.UTF8.GetString(data);
            var html = new HtmlDocument();
            html.LoadHtml(raw_html);
            var html_menu = html.GetElementbyId("issues").Elements("li");
            List<string> test = new List<string>();

            int num = 0;
            int id = new Random().Next() + 1;
            foreach (var item in html_menu)
            {
                List<Item> menu = new List<Item>();
                try
                {
                    string result = HttpUtility.HtmlDecode(item.Element("div").Element("span").InnerText);
                    var matches = Regex.Matches(result, "(.*?),(.*?)гр");
                    foreach (Match m in matches)
                    {
                        menu.Add(
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

                if (menu.Count > 0)
                {
                    choice.Add(new Choice() { Id = id, Menu = menu, Name = "Полный обед", Price = price[0], OnDate = MondayDay.AddDays(num) });
                    if (menu.Count > 2)
                    {
                        menu = new List<Item>(menu);
                        menu.RemoveAt(1);
                        choice.Add(new Choice() { Id = ++id, Menu = menu, Name = "Без первого", Price = price[1], OnDate = MondayDay.AddDays(num) });
                    }
                }


                ++num;
                if (num > 4) break;
            }

            List<UserDay> days = new List<UserDay>();




            // TODO: Get days from base, if no exist generate like this
            for (int i = 0; i < 5; i++)
            {
                days.Add(new UserDay() { Id = i, Date = MondayDay.AddDays(i), select = nochoice });

            };

            UserDay nextmonday = new UserDay() { Id = 7, Date = MondayDay.AddDays(7), select = nochoice };
            days.Add(nextmonday);

            Choice monday = choice[1];
            Choice monday_wf = choice[2];
            choice.Add(new Choice() { Id = id, Name = "Полный обед", Menu = monday.Menu, OnDate = MondayDay.AddDays(7), Price = monday.Price });
            choice.Add(new Choice() { Id = ++id, Name = "Без первого", Menu = monday_wf.Menu, OnDate = MondayDay.AddDays(7), Price = monday_wf.Price });

            Week tq = new Week() { Id = 1, Title = "Select Dinner", Days = days, ChoiceSet = choice };
            return tq;
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        [System.Web.Http.HttpPost]
        public bool Post(List<UserDay> answer)
        {
            // Put days in base
            return true;
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}

