using System;
using System.Collections.Generic;
using System.Text;

namespace Tbh.Online.Test.Model.App
{
    public class AppAssessDetails
    {
        public int Id { get; set; }
        public double Point { get; set; }
        public double ActualPoint { get; set; }
        public string AssessedBy { get; set; }
        public int ExamineeId { get; set; }
        public int ExamId { get; set; }
    }
}
