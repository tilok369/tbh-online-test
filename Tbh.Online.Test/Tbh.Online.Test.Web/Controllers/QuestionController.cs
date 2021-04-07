using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tbh.Online.Test.Model.App;
using Tbh.Online.Test.Service.Interfaces;

namespace Tbh.Online.Test.Web.Controllers
{
    [Route("api/v{version:apiVersion}/Question")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly IQuestionService _questionService;

        public QuestionController(IQuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpGet()]
        public ActionResult<AppExamQuestion> GetQuestions(int examId)
        {
            var data = _questionService.Get(examId);
            return Ok(data);
        }

        [HttpPost()]
        public ActionResult<CrudResult> SaveQuestions(AppExamQuestion question)
        {
            var data = _questionService.Save(question.Exam, question.Questions, User.Identity.Name);
            return Ok(data);
        }

        [HttpGet("exams")]
        public ActionResult<List<AppExam>> GetExams()
        {
            var data = _questionService.GetExams();
            return Ok(data);
        }
    }
}
