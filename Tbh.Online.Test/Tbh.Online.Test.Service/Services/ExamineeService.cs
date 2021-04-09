using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
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
        private readonly MapperConfiguration _config;
        public ExamineeService(string connectionString):base(connectionString)
        {
            _examRepository = new ExamRepository(connectionString);
            _config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<AppExaminee, Examinee>();
                cfg.CreateMap<AppAnswer, Answer>();
                cfg.CreateMap<Exam, AppExam>();
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
    }
}
