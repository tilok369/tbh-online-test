using System;
using System.Collections.Generic;
using System.Text;

namespace Tbh.Online.Test.Model.App
{
    public class AppAnswerDetails
    {
        public int ExamId { get; set; }
        public int ExamineeId { get; set; }
        public int AnswerId { get; set; }
        public int QuestionId { get; set; }
        public string Text { get; set; }
        public string SubText { get; set; }
        public double? Point { get; set; }
        public int TypeId { get; set; }
        public string AnswerText { get; set; }
        public double? AnswerPoint { get; set; }
        public string ExamineeName { get; set; }
        public string ExamineeEmail { get; set; }
        public string ExamineePhone { get; set; }
        public int Duration { get; set; }
        public string Title { get; set; }
        public string AssessedBy { get; set; }
    }
}
