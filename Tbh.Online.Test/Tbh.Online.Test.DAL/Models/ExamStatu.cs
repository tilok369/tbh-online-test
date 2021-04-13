using System;
using System.Collections.Generic;

#nullable disable

namespace Tbh.Online.Test.DAL.Models
{
    public partial class ExamStatu
    {
        public int Id { get; set; }
        public int ExamId { get; set; }
        public int ExamineeId { get; set; }
        public int Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public double TotalMarks { get; set; }
        public double ObtainedMarks { get; set; }

        public virtual Exam Exam { get; set; }
        public virtual Examinee Examinee { get; set; }
    }
}
