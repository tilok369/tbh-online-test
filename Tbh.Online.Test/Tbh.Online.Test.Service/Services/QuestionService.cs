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
    public class QuestionService: GenericCrudService, IQuestionService
    {

        private readonly IQuestionRepository _questionRepository;
        private readonly MapperConfiguration _config;

        public QuestionService(string connectionString): base(connectionString)
        {
            _questionRepository = new QuestionRepository(connectionString);
            _config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<AppExam, Exam>();
                cfg.CreateMap<AppQuestion, Question>();
                cfg.CreateMap<Exam, AppExam>();
                cfg.CreateMap<Question, AppQuestion>();
            });
        }

        public AppExamQuestion Get(int id)
        {
            var mapper = _config.CreateMapper();
            return new AppExamQuestion
            {
                Exam = mapper.Map<Exam, AppExam>(_questionRepository.GetExam(id)),
                Questions = mapper.Map<List<Question>, List<AppQuestion>>(_questionRepository.GetByExam(id))
            };
        }

        public CrudResult Save(AppExam exam, List<AppQuestion> questions)
        {
            var mapper = _config.CreateMapper();
            var dbExam = mapper.Map<AppExam, Exam>(exam);          

            var examSaveResult = exam.Id == 0 ? Add<Exam>(dbExam) : Edit<Exam>(dbExam);
            if (examSaveResult.Success)
            {
                var examItem = (Exam)examSaveResult.Entity;
                var dbQuesions = mapper.Map<List<AppQuestion>, List<Question>>(questions);

                foreach (var qus in dbQuesions)
                {
                    qus.ExamId = examItem.Id;
                    var questionAddResult = qus.Id == 0 ? Add<Question>(qus) : Edit<Question>(qus);
                    if (!questionAddResult.Success) return new CrudResult(questionAddResult.Success, questionAddResult.Message);
                }
            }

            return new CrudResult(examSaveResult.Success, examSaveResult.Message);
        }
    }
}
