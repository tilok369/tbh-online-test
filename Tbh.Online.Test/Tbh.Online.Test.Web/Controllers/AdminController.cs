using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Tbh.Online.Test.Web.Controllers
{
    [Authorize]
    public class AdminController : Controller
    {
        public IActionResult Dashboard()
        {
            return View();
        }

        public IActionResult QuestionCreate()
        {
            return View();
        }

        public IActionResult QuestionView()
        {
            return View();
        }

        public IActionResult Assessment()
        {
            return View();
        }
    }
}
