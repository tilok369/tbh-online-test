using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Tbh.Online.Test.Service.Interfaces;

namespace Tbh.Online.Test.Web.Controllers
{
    public class TestController : Controller
    {
        private readonly IExamineeService _examineeService;
        public TestController(IExamineeService examineeService)
        {
            _examineeService = examineeService;
        }
        public IActionResult Info(string ec)
        {
            ViewBag.EC = ec;
            var exam = _examineeService.GetExamByCode(ec);
            if (exam != null)
            {
                ViewBag.ExamId = exam.Id;
                ViewBag.Status = exam.Status;
                ViewBag.Title = exam.Title;
                ViewBag.Duration = exam.Duration;
                ViewBag.TotalQuestions = exam.TotalQuestions;
            }
            return View();
        }

        public IActionResult Start(string ec, int examineeId)
        {
            var exam = _examineeService.GetExamByCode(ec);
            if (exam != null) 
            {
                ViewBag.ExamId = exam.Id;
                ViewBag.Status = exam.Status;
            }
            ViewBag.ExamineeId = examineeId;
            return View();
        }
    }
}
