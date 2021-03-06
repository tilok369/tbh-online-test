using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Tbh.Online.Test.DAL.DataModels;
using Tbh.Online.Test.DAL.Interfaces;
using Tbh.Online.Test.DAL.Models;
using Tbh.Online.Test.DAL.Repositories;
using Tbh.Online.Test.Model.App;
using Tbh.Online.Test.Service.Interfaces;

namespace Tbh.Online.Test.Service.Services
{

    public class ExamineeService : GenericCrudService, IExamineeService
    {
        private IExamRepository _examRepository;
        private IQuestionRepository _questionRepository;
        private IUserRepository _userRepository;
        private readonly MapperConfiguration _config;
        public ExamineeService(string connectionString):base(connectionString)
        {
            _examRepository = new ExamRepository(connectionString);
            _questionRepository = new QuestionRepository(connectionString);
            _userRepository = new UserRepository(connectionString);
            _config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<AppExaminee, Examinee>();
                cfg.CreateMap<AppAnswer, Answer>();
                cfg.CreateMap<Exam, AppExam>();
                cfg.CreateMap<AppExamStatus, ExamStatu>();
                cfg.CreateMap<ExamineeDetails, AppExamineeDetails>();
                cfg.CreateMap<AnswerDetails, AppAnswerDetails>();
                cfg.CreateMap<ExamineeScoreDetails, AppExamineeScoreDetails>();
                cfg.CreateMap<AppExamineeScoreDetails, ExamineeScore>();
            });
        }
        public CrudResult Add(AppExaminee examinee)
        {
            if (examinee != null) 
            { 
                examinee.CreatedBy = examinee.UpdatedBy = examinee.Name;
                examinee.CreatedOn = DateTime.Now;
                examinee.UpdatedOn = DateTime.Now;
            }
            var exmn = _examRepository.GetExamineeByExamAndEmail((int)examinee.ExamId, examinee.Email);
            if (exmn != null) return new CrudResult(false, "You have already taken this exam and not allowed to participate again!");
            
            var mapper = _config.CreateMapper();
            var dbExaminee = mapper.Map<AppExaminee, Examinee>(examinee);
            var result = Add<Examinee>(dbExaminee);

            return new CrudResult(result.Success, result.Message, result.Success ? ((Examinee)result.Entity).Id : 0);
        }

        public CrudResult SubmitAnswer(AppAnswer answer)
        {
            answer.CreatedBy = answer.UpdatedBy = answer.ExamineeId.ToString();
            answer.CreatedOn = DateTime.Now;
            answer.UpdatedOn = DateTime.Now;

            var examStatus = _examRepository.GetExamStatus(answer.ExamId, answer.ExamineeId);
            if (examStatus.Status == 2 || examStatus.Status == -1)
                return new CrudResult(false, "You have already participated in this exam, you cannot submit any ansswer now");

            var mapper = _config.CreateMapper();
            var dbAnswer = mapper.Map<AppAnswer, Answer>(answer);
            var result = dbAnswer.Id == 0 ? Add<Answer>(dbAnswer) : Edit<Answer>(dbAnswer);

            return new CrudResult(result.Success, result.Message, result.Success ? ((Answer)result.Entity).Id : 0);
        }

        public CrudResult CompleteTest(AppExamStatus examStatus)
        {
            examStatus.CreatedBy = examStatus.UpdatedBy = examStatus.ExamineeId.ToString();
            examStatus.CreatedOn = DateTime.Now;
            examStatus.UpdatedOn = DateTime.Now;

            var mapper = _config.CreateMapper();
            var dbExamStatus = mapper.Map<AppExamStatus, ExamStatu>(examStatus);
            var result = dbExamStatus.Id == 0 ? Add<ExamStatu>(dbExamStatus) : Edit<ExamStatu>(dbExamStatus);

            return new CrudResult(result.Success, result.Message, result.Success ? ((ExamStatu)result.Entity).Id : 0);
        }

        public AppExam GetExamByCode(string code)
        {
            var mapper = _config.CreateMapper();
            var exam = mapper.Map<Exam, AppExam>(_examRepository.GetExamByCode(code));
            return exam;
        }

        public List<AppExamineeDetails> GetExamineeDetails(int examId)
        {
            var mapper = _config.CreateMapper();
            var details = mapper.Map<List<ExamineeDetails>, List<AppExamineeDetails>>(_examRepository.GetExamStatus(examId));
            return details;
        }

        public List<AppAnswerDetails> GetAnswerDetailsByExaminee(int examId, int examineeId)
        {
            var mapper = _config.CreateMapper();
            var details = mapper.Map<List<AnswerDetails>, List<AppAnswerDetails>>(_examRepository.GetAnswerDetailsByExaminee(examId, examineeId));
            return details; ;
        }

        public CrudResult SubmitPoint(List<AppAssessDetails> assessDetails)
        {
            if(!assessDetails.Any())
                return new CrudResult(false, "No assessment to save");
            foreach (var i in assessDetails)
            {
                var item = Get<Answer>(i.Id);
                if (item == null) return new CrudResult(false, "Error");
                item.AssessedBy = i.AssessedBy;
                item.Point = i.Point;
                var result = Edit<Answer>(item);
                if (!result.Success) return new CrudResult(result.Success, result.Message);
            }

            var examStat = _examRepository.GetExamStatus(assessDetails[0].ExamId, assessDetails[0].ExamineeId);
            if(examStat == null)
                return new CrudResult(false, "Error");

            var questions = _questionRepository.GetByExam(assessDetails[0].ExamId);

            examStat.TotalMarks = questions.Sum(a => a.Point??0.0);
            examStat.ObtainedMarks = assessDetails.Sum(a => a.Point);
            var resultStat = Edit<ExamStatu>(examStat);

            return new CrudResult(resultStat.Success, resultStat.Message);
        }
        public List<AppExamineeScoreDetails> GetScoreByExaminee(int examineeId, string examiner, int examId)
        {
            var mapper = _config.CreateMapper();
            var score = mapper.Map<List<ExamineeScoreDetails>, List<AppExamineeScoreDetails>>(_examRepository.GetScoreByExaminee(examineeId));
            var loggedinUser = _userRepository.GetByEmail(examiner);
            if (score.Exists(u => u.Examiner.Equals(loggedinUser.Email)) == true)
            {
                return score;
            }
            else
            {
                score.Add(new AppExamineeScoreDetails
                {
                    Id = 0,
                    ExaminerId = loggedinUser.Id,
                    ExamineeId = examineeId,
                    ExamId = examId,
                    Examiner = loggedinUser.Email,
                    Score = 0d,
                });
                return score;
            }
           
        }
        public CrudResult SaveScore(AppExamineeScoreDetails scores)
        {
            var mapper = _config.CreateMapper();
            var score = mapper.Map<AppExamineeScoreDetails, ExamineeScore>(scores);
            var dbExamineeScore = _examRepository.SaveScore(score);
            return new CrudResult(dbExamineeScore, "success");
        }

        public CrudResult Shortlist(AppExaminee shortlist)
        {
            var mapper = _config.CreateMapper();
            var shortlisted = mapper.Map<AppExaminee, Examinee>(shortlist);
            var examinee = _examRepository.GetExamineeById(shortlisted.Id);
            examinee.Shortlist = shortlist.Shortlist;
            var dbExaminee = _examRepository.Shortlist(examinee);
            return new CrudResult(dbExaminee, "success");
        }
    }
}
