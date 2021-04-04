using System;
using System.Collections.Generic;
using System.Text;
using Tbh.Online.Test.Model.App;

namespace Tbh.Online.Test.Service.Interfaces
{
    public interface IGenricCrudService
    {
        CrudResult Add<T>(T entity) where T : class;
        CrudResult Edit<T>(T entity) where T : class;
        CrudResult Delete<T>(T entity) where T : class;
        CrudResult Delete<T>(int id) where T : class;
        CrudResult DeleteAll<T>(List<T> entityList) where T : class;
        //CrudResult DeleteByPorperty<T>(Expression<Func<T, bool>> predicate) where T : class;
        T Get<T>(int id) where T : class;
        //List<T> GetByProperty<T>(Expression<Func<T, bool>> predicate) where T : class;
        List<T> GetAll<T>() where T : class;
    }
}
