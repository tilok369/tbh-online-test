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

        public IActionResult QuestionView(int examId)
        {
            ViewBag.ExamId = examId;
            return View();
        }

        public IActionResult Assessment(int examId, int examineeId)
        {
            ViewBag.ExamId = examId;
            ViewBag.ExamineeId = examineeId;
            return View();
        }

        public IActionResult Examinees(int examId)
        {
            ViewBag.ExamId = examId;
            return View();
        }
    }
}
