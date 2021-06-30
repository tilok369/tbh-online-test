using System;
using System.Collections.Generic;

#nullable disable

namespace Tbh.Online.Test.DAL.Models
{
    public partial class ExamineeScore
    {
        public int Id { get; set; }
        public int ExamId { get; set; }
        public int ExamineeId { get; set; }
        public int ExaminerId { get; set; }
        public double? Score { get; set; }

        public virtual Exam Exam { get; set; }
        public virtual Examinee Examinee { get; set; }
        public virtual User Examiner { get; set; }
    }
}
