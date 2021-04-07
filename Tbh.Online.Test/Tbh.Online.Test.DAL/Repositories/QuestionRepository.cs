using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Tbh.Online.Test.DAL.Interfaces;
using Tbh.Online.Test.DAL.Models;

namespace Tbh.Online.Test.DAL.Repositories
{
    public class QuestionRepository: IQuestionRepository
    {
        private readonly DbContextOptionsBuilder<OnlineTestContext> _dbContextOptionBuilder;


        public QuestionRepository(string connectionString)
        {
            _dbContextOptionBuilder = new DbContextOptionsBuilder<OnlineTestContext>();
            _dbContextOptionBuilder.UseSqlServer(connectionString);
        }

        public List<Question> GetByExam(int examId)
        {
            using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
            {
                return context.Questions.Where(q => q.ExamId == examId).ToList();
            }
        }

        public Exam GetExam(int id)
        {
            using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
            {
                return context.Exams.FirstOrDefault(e => e.Id == id);
            }
        }

        public List<Exam> GetExams()
        {
            using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
            {
                return context.Exams.OrderByDescending(e=>e.CreatedOn).ToList();
            }
        }
    }
}
