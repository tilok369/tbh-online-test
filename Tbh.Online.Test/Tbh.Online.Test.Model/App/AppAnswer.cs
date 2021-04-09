using System;
using System.Collections.Generic;
using System.Text;

namespace Tbh.Online.Test.Model.App
{
    public class AppAnswer
    {
        public int Id { get; set; }
        public int ExamId { get; set; }
        public int ExamineeId { get; set; }
        public string Text { get; set; }
        public double? Point { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public int QuestionId { get; set; }
    }
}
