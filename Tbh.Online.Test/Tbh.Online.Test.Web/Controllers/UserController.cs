using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Tbh.Online.Test.Web.Controllers
{
    public class UserController : Controller
    {
        public IActionResult UserList()
        {
            return View();
        }
    }
}
