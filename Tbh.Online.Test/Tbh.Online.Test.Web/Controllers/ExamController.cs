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
        public ActionResult<CrudResult> GetQuestions(AppExaminee examinee)
        {
            var data = _examineeService.Add(examinee);
            return Ok(data);
        }
    }
}
