using System;
using System.Collections.Generic;
using System.Text;

namespace Tbh.Online.Test.Model.App
{
    public class AppExam
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int TotalQuestions { get; set; }
        public int Duration { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
    }
}
