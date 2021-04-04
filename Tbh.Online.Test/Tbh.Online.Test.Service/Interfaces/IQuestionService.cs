using System;
using System.Collections.Generic;
using System.Text;
using Tbh.Online.Test.Model.App;

namespace Tbh.Online.Test.Service.Interfaces
{
    public interface IQuestionService
    {
        CrudResult Save(AppExam exam, List<AppQuestion> questions);
        AppExamQuestion Get(int id);
    }
}
