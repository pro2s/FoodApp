using Food.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Food.Api
{
    public interface IMenuParser
    {
        string Id();
        List<Menu> ParseMenu(DateTime? start);
        List<Menu> GetDayMenu();
        Dictionary<string, string> GetInfo();
    }
}
