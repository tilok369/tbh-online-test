using System;
using System.Collections.Generic;

#nullable disable

namespace Tbh.Online.Test.DAL.Models
{
    public partial class Examinee
    {
        public Examinee()
        {
            Answers = new HashSet<Answer>();
            ExamStatus = new HashSet<ExamStatu>();
        }

        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public string Phone { get; set; }

        public virtual ICollection<Answer> Answers { get; set; }
        public virtual ICollection<ExamStatu> ExamStatus { get; set; }
    }
}
