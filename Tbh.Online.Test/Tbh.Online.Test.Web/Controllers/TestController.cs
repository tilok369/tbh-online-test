using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Tbh.Online.Test.Web.Controllers
{
    public class TestController : Controller
    {
        public IActionResult Info()
        {
            return View();
        }

        public IActionResult Start(int examineeId)
        {
            ViewBag.ExamineeId = examineeId;
            return View();
        }
    }
}
