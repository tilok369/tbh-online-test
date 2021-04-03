using System;
using System.Collections.Generic;
using System.Text;

namespace Tbh.Online.Test.DAL.Interfaces
{
    public interface IGenericRepository
    {
        T Add<T>(T entity) where T : class;
        T Delete<T>(T entity) where T : class;
        T Edit<T>(T entity) where T : class;
        T Delete<T>(int id) where T : class;
        bool AddAll<T>(List<T> entityList) where T : class;
        bool EditAll<T>(List<T> entityList) where T : class;
        bool DeleteAll<T>(List<T> entityList) where T : class;
        T Get<T>(int id) where T : class;
        List<T> GetAll<T>() where T : class;
    }
}
