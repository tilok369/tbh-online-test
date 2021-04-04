using System;
using System.Collections.Generic;
using System.Text;

namespace Tbh.Online.Test.Model.App
{
    public class AppQuestion
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
        public string SubText { get; set; }
    }
}
