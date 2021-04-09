using System;
using System.Collections.Generic;
using System.Text;
using Tbh.Online.Test.DAL.Models;

namespace Tbh.Online.Test.DAL.Interfaces
{
    public interface IExamRepository
    {
        Exam GetExamByCode(string code);
    }
}
