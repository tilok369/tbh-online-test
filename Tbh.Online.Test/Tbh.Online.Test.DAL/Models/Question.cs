using System;
using System.Collections.Generic;

#nullable disable

namespace Tbh.Online.Test.DAL.Models
{
    public partial class Question
    {
        public int Id { get; set; }
        public int ExamId { get; set; }
        public int TypeId { get; set; }
        public string Text { get; set; }
        public string Options { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }

        public virtual Exam Exam { get; set; }
        public virtual QuestionType Type { get; set; }
    }
}
