using System;
using System.Collections.Generic;
using System.Text;
using Tbh.Online.Test.Model.App;

namespace Tbh.Online.Test.Service.Interfaces
{
    public interface IExamineeService
    {
        CrudResult Add(AppExaminee examinee);
        CrudResult SubmitAnswer(AppAnswer answer);
        CrudResult CompleteTest(AppExamStatus examStatus);
    }
}
