﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Tbh.Online.Test.DAL.DataModels
{
    public class ExamineeDetails
    {
        public int ExamId { get; set; }
        public int ExamineeId { get; set; }
        public int ExamStatusId { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public int Status { get; set; }
    }
}