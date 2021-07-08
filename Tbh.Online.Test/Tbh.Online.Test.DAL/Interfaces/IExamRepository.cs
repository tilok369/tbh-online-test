using System;
using System.Collections.Generic;
using System.Text;
using Tbh.Online.Test.DAL.DataModels;
using Tbh.Online.Test.DAL.Models;

namespace Tbh.Online.Test.DAL.Interfaces
{
    public interface IExamRepository
    {
        Exam GetExamByCode(string code);
        List<ExamineeDetails> GetExamStatus(int examId);
        List<AnswerDetails> GetAnswerDetailsByExaminee(int examId, int examineeId);
        ExamStatu GetExamStatus(int examId, int examineeId);
        Examinee GetExamineeByExamAndEmail(int examId, string email);
        List<ExamineeScoreDetails> GetScoreByExaminee(int examineeId);
        bool SaveScore(ExamineeScore score);
    }
}
