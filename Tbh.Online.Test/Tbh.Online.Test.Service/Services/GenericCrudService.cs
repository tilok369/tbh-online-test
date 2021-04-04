using System;
using System.Collections.Generic;
using System.Text;
using Tbh.Online.Test.DAL.Interfaces;
using Tbh.Online.Test.DAL.Repositories;
using Tbh.Online.Test.Model.App;

namespace Tbh.Online.Test.Service.Services
{
    public class GenericCrudService
    {
        private readonly IGenericRepository _genericCrudRepository;
        public GenericCrudService(string connectionString)
        {
            _genericCrudRepository = new GenericRepository(connectionString);
        }

        public CrudResult Add<T>(T entity) where T : class
        {
            try
            {
                var result = _genericCrudRepository.Add(entity);
                return new CrudResult
                {
                    Success = true,
                    Message = "Add Successful",
                    Entity = result
                };
            }
            catch (Exception exception)
            {
                return new CrudResult
                {
                    Success = false,
                    Message = exception.Message,
                    Entity = null
                };
            }
        }


        public CrudResult AddAll<T>(List<T> entityList) where T : class
        {
            try
            {
                var result = _genericCrudRepository.AddAll(entityList);
                return result ? new CrudResult
                {
                    Success = true,
                    Message = "Add All Successful",
                    Entity = result
                } : new CrudResult
                {
                    Success = false,
                    Message = "Add All Error",
                    Entity = result
                };
            }
            catch (Exception exception)
            {
                return new CrudResult
                {
                    Success = false,
                    Message = exception.Message,
                    Entity = null
                };
            }
        }

        public CrudResult Edit<T>(T entity) where T : class
        {
            try
            {
                var result = _genericCrudRepository.Edit(entity);
                return new CrudResult
                {
                    Success = true,
                    Message = "Edit Successful",
                    Entity = result
                };
            }
            catch (Exception exception)
            {
                return new CrudResult
                {
                    Success = false,
                    Message = exception.Message,
                    Entity = null
                };
            }
        }


        public CrudResult EditAll<T>(List<T> entityList) where T : class
        {
            try
            {
                var result = _genericCrudRepository.EditAll(entityList);
                return result ? new CrudResult
                {
                    Success = true,
                    Message = "Edit All Successful",
                    Entity = result
                } : new CrudResult
                {
                    Success = true,
                    Message = "Edit All Error",
                    Entity = result
                };
            }
            catch (Exception exception)
            {
                return new CrudResult
                {
                    Success = false,
                    Message = exception.Message,
                    Entity = null
                };
            }
        }

        public CrudResult Delete<T>(T entity) where T : class
        {
            try
            {
                return new CrudResult
                {
                    Success = true,
                    Message = "Delete Successful",
                    Entity = _genericCrudRepository.Delete<T>(entity)
                };
            }
            catch (Exception exception)
            {
                return new CrudResult
                {
                    Success = false,
                    Message = exception.Message,
                    Entity = null
                };
            }
        }

        public CrudResult Delete<T>(int id) where T : class
        {
            try
            {
                var result = _genericCrudRepository.Delete<T>(id);
                return new CrudResult
                {
                    Success = true,
                    Message = "Delete Successful",
                    Entity = null
                };
            }
            catch (Exception exception)
            {
                return new CrudResult
                {
                    Success = false,
                    Message = exception.Message,
                    Entity = null
                };
            }
        }

        public CrudResult DeleteAll<T>(List<T> entityList) where T : class
        {
            try
            {
                var result = _genericCrudRepository.DeleteAll<T>(entityList);
                return result ? new CrudResult
                {
                    Success = true,
                    Message = "Delete Successful",
                    Entity = result
                } : new CrudResult
                {
                    Success = true,
                    Message = "Delete All Error",
                    Entity = result
                };
            }
            catch (Exception exception)
            {
                return new CrudResult
                {
                    Success = false,
                    Message = exception.Message,
                    Entity = null
                };
            }
        }

        public T Get<T>(int id) where T : class
        {
            return _genericCrudRepository.Get<T>(id);
        }

        public List<T> GetAll<T>() where T : class
        {
            return _genericCrudRepository.GetAll<T>();
        }
    }
}
