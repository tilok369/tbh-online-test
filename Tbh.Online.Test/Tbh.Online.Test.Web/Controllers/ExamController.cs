﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tbh.Online.Test.Model.App;
using Tbh.Online.Test.Service.Interfaces;

namespace Tbh.Online.Test.Web.Controllers
{
    [Route("api/v{version:apiVersion}/Exam")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly IExamineeService _examineeService;

        public ExamController(IExamineeService examineeService)
        {
            _examineeService = examineeService;
        }

        [HttpPost("examinee")]
        public ActionResult<CrudResult> AddQuestions(AppExaminee examinee)
        {
            var data = _examineeService.Add(examinee);
            return Ok(data);
        }

        [HttpPost("answer")]
        public ActionResult<CrudResult> SubmitAnswer(AppAnswer answer)
        {
            var data = _examineeService.SubmitAnswer(answer);
            return Ok(data);
        }

        [HttpPost("complete")]
        public ActionResult<CrudResult> Complete(AppExamStatus examStatus)
        {
            var data = _examineeService.CompleteTest(examStatus);
            return Ok(data);
        }
    }
}
