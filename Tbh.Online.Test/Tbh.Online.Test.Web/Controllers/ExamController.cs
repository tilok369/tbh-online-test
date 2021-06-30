using System;
using System.Collections.Generic;
using System.IO;
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
        public ActionResult<CrudResult> AddExaminee(AppExaminee examinee)
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

        [HttpPost("status")]
        public ActionResult<CrudResult> Complete(AppExamStatus examStatus)
        {
            var data = _examineeService.CompleteTest(examStatus);
            return Ok(data);
        }

        [HttpGet("examinee")]
        public ActionResult<List<AppExamineeDetails>> ExamineeDetails(int examId)
        {
            var data = _examineeService.GetExamineeDetails(examId);
            return Ok(data);
        }

        [HttpGet("answer")]
        public ActionResult<List<AppAnswerDetails>> AnswerDetails(int examId, int examineeId)
        {
            var data = _examineeService.GetAnswerDetailsByExaminee(examId, examineeId);
            return Ok(data);
        }

        [HttpPost("assess")]
        public ActionResult<CrudResult> SubmitPoint(List<AppAssessDetails> assessDetails)
        {
            var data = _examineeService.SubmitPoint(assessDetails);
            return Ok(data);
        }
       
        //[HttpPost("cv")]
        //public IActionResult UploadCV(IFormFile file, AppExamineeDetails examineeId)
        //{
        //    var data = _examineeService.UploadCV(file, examineeId);
        //    return Ok(data);
        //}
        //public IActionResult UploadCV(IFormFile file, AppExamineeDetails examineeId)
        //{

        //    if (file != null)
        //    {
        //        if (file.Length > 0)
        //        {
        //            var cv = new AppExamineeDetails();
        //            using (var target = new MemoryStream())
        //            {
        //                file.CopyTo(target);
        //                cv.CV = target.ToArray();
        //            }

        //        }
        //    }

        //}

    }
}
