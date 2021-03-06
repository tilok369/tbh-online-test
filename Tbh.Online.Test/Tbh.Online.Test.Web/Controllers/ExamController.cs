using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
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
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ExamController(IExamineeService examineeService, IWebHostEnvironment webHostEnvironment)
        {
            _examineeService = examineeService;
            _webHostEnvironment = webHostEnvironment;
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

        [HttpGet("examineeScore")]
        public ActionResult<List<AppExamineeScoreDetails>> ExamineeScore(int examineeId, int examId)
        {
            
            var data = _examineeService.GetScoreByExaminee(examineeId, User.Identity.Name, examId);
            return Ok(data);
        }

        [HttpPost("saveScore")]
        public ActionResult<CrudResult> EditScore(AppExamineeScoreDetails scores)
        {
            var data = _examineeService.SaveScore(scores);

            return Ok(data);
        }

        [HttpPost("shortlist")]
        public ActionResult<CrudResult> Shortlist(AppExaminee shortlist)
        {
            var data = _examineeService.Shortlist(shortlist);

            return Ok(data);
        }
        [HttpPost("cv")]
        public IActionResult UploadCV(IFormFile file)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
        {
            if (file != null)
            {
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "examineeCV");
                string filePath = Path.Combine(uploadsFolder, file.FileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    file.CopyTo(fileStream);
                }
                return new ObjectResult(new { status = "success" });
            }

            return new ObjectResult(new { status = "fail" });
        }



    }
}
