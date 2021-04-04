using System;
using System.Collections.Generic;
using System.Text;

namespace Tbh.Online.Test.Model.App
{
    public class AppExamQuestion
    {
        public AppExam Exam { get; set; }
        public List<AppQuestion> Questions { get; set; }
    }
}
