using System;
using System.Collections.Generic;
using System.Text;

namespace Tbh.Online.Test.Model.App
{
    public class AppExamineeScoreDetails
    {
        public int Id { get; set; }
        public int ExaminerId { get; set; }
        public int ExamineeId { get; set; }
        public int ExamId { get; set; }
        public string Examiner { get; set; }
        public double Score { get; set; }

    }
}
