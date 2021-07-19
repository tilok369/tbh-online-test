using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Tbh.Online.Test.DAL.DataModels;
using Tbh.Online.Test.DAL.Interfaces;
using Tbh.Online.Test.DAL.Models;

namespace Tbh.Online.Test.DAL.Repositories
{
    public class ExamRepository: IExamRepository
    {
        private readonly DbContextOptionsBuilder<OnlineTestContext> _dbContextOptionBuilder;

        public ExamRepository(string connectionString)
        {
            _dbContextOptionBuilder = new DbContextOptionsBuilder<OnlineTestContext>();
            _dbContextOptionBuilder.UseSqlServer(connectionString);
        }

        public List<AnswerDetails> GetAnswerDetailsByExaminee(int examId, int examineeId)
        {
            using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
            {
                var result = (from exam in context.Exams
                              join qus in context.Questions
                              on exam.Id equals qus.ExamId
                              join answer in context.Answers
                              on qus.Id equals answer.QuestionId
                              join examinee in context.Examinees
                              on answer.ExamineeId equals examinee.Id
                              where exam.Id == examId && answer.ExamineeId == examineeId
                              select new AnswerDetails
                              {
                                  ExamId = exam.Id,
                                  ExamineeId =answer.ExamineeId,
                                  AnswerId = answer.Id,
                                  QuestionId = qus.Id,
                                  Text = qus.Text,
                                  SubText = qus.SubText,
                                  Point = qus.Point,
                                  TypeId = qus.TypeId,
                                  AnswerText = answer.Text,
                                  AnswerPoint = answer.Point,
                                  ExamineeName = examinee.Name,
                                  ExamineeEmail = examinee.Email,
                                  ExamineePhone = examinee.Phone,
                                  Title = exam.Title,
                                  Duration = exam.Duration,
                                  AssessedBy = answer.AssessedBy??""
                              }).OrderBy(a => a.QuestionId).ToList();

                return result;
            }
        }

        public Exam GetExamByCode(string code)
        {
            using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
            {
                return context.Exams.FirstOrDefault(e => e.ExameCode.Equals(code));
            }
        }

        public Examinee GetExamineeByExamAndEmail(int examId, string email)
        {
            using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
            {
                return context.Examinees.FirstOrDefault(e => e.Email.Equals(email) && e.ExamId == examId);
            }
        }

        public List<ExamineeDetails> GetExamStatus(int examId)
        {
            using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
            {
                var submittedsQuestions = context.Answers.Where(a => a.ExamId == examId)
                    .GroupBy(a => a.ExamineeId)
                    .Select(a => new { ExamineeId = a.Key, Total = a.Select(x=>x.QuestionId).Distinct().Count() });

                var result = (from exam in context.Exams
                              join stat in context.ExamStatus
                              on exam.Id equals stat.ExamId
                              join examinee in context.Examinees
                              on stat.ExamineeId equals examinee.Id
                              where exam.Id == examId
                              select new ExamineeDetails
                              {
                                  ExamId = exam.Id,
                                  ExamineeId = examinee.Id,
                                  ExamStatusId = stat.Id,
                                  Title = exam.Title,
                                  Name = examinee.Name,
                                  Phone = examinee.Phone,
                                  Email = examinee.Email,
                                  Status =stat.Status,
                                  TotalMarks = stat.TotalMarks,
                                  ObtainedMarks = stat.ObtainedMarks,
                                  Shortlist = examinee.Shortlist
                              }).OrderByDescending(t=>t.Shortlist)
                              .ThenByDescending(t => t.Status)
                              .ThenByDescending(t=>t.ObtainedMarks).ToList();

                foreach (var res in result)
                {
                    var item = submittedsQuestions.FirstOrDefault(s => s.ExamineeId == res.ExamineeId);
                    res.TotalSubmission = item?.Total ?? 0;
                }

                return result;
            }
        }

        public ExamStatu GetExamStatus(int examId, int examineeId)
        {
            using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
            {
                return context.ExamStatus.FirstOrDefault(e => e.ExamId == examId && e.ExamineeId == examineeId);
            }
        }

        public List<ExamineeScoreDetails> GetScoreByExaminee(int examineeId)
        {
            using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
            {
               
                    var result = (from score in context.ExamineeScores
                                  join user in context.Users
                                  on score.ExaminerId equals user.Id
                                  where score.ExamineeId == examineeId
                                  select new ExamineeScoreDetails
                                  {
                                      Id = score.Id,
                                      ExaminerId = user.Id,
                                      ExamineeId = examineeId,
                                      ExamId = score.ExamId,
                                      Examiner = user.Email,
                                      Score = score.Score ?? 0,
                                  }).ToList();
               
                    return result;
                
            }

        }
        public bool SaveScore(ExamineeScore score)
        {

            try
            {
                using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
                {
                   
                    if (score.Id == 0 )
                    {
                        context.ExamineeScores.Add(score);
                        context.SaveChanges();
                    }
                    else
                    {
                        context.Entry(score).State = EntityState.Modified;
                        context.SaveChanges();
                    }
                    return true;
                }
            }
            catch (Exception)
            {

                return false;
            }
        }
        public Examinee GetExamineeById(int examineeId)
        {
            using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
            {
                return context.Examinees.FirstOrDefault(e => e.Id == examineeId);
            }
        }
        public bool Shortlist(Examinee shortlist)
        {
            try
            {
                using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
                {
                   
                    context.Entry(shortlist).State = EntityState.Modified;
                    context.SaveChanges();
                    
                    return true; 
                }
            }
            catch (Exception ex)
            {

                return false;
            }
        }

        //public Examinee UploadCv(int examineeId)
        //{
        //    using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
        //    {
        //        String FileExt = Path.GetExtension().ToUpper();
        //    }
        //}
    }
}
