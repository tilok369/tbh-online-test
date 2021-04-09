using System;
using System.Collections.Generic;

#nullable disable

namespace Tbh.Online.Test.DAL.Models
{
    public partial class Exam
    {
        public Exam()
        {
            Answers = new HashSet<Answer>();
            ExamStatus = new HashSet<ExamStatu>();
            Questions = new HashSet<Question>();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public int TotalQuestions { get; set; }
        public int Duration { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public bool Status { get; set; }
        public string ExameCode { get; set; }

        public virtual ICollection<Answer> Answers { get; set; }
        public virtual ICollection<ExamStatu> ExamStatus { get; set; }
        public virtual ICollection<Question> Questions { get; set; }
    }
}
