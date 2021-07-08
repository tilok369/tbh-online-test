using System;
using System.Collections.Generic;
using System.Text;

namespace Tbh.Online.Test.DAL.DataModels
{
    public class ExamineeScoreDetails
    {

        public int ExaminerId { get; set; }
        public int ExamineeId { get; set; }
        public int ExamId { get; set; }
        public string Examiner { get; set; }
        public double Score { get; set; }
        
    }
}
