using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using Tbh.Online.Test.DAL.Models;
using Tbh.Online.Test.Model.App;
using Tbh.Online.Test.Service.Interfaces;

namespace Tbh.Online.Test.Service.Services
{
    public class ExamineeService : GenericCrudService, IExamineeService
    {
        private string _connectionString;
        private readonly MapperConfiguration _config;
        public ExamineeService(string connectionString):base(connectionString)
        {
            _config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<AppExaminee, Examinee>();
            });
        }
        public CrudResult Add(AppExaminee examinee)
        {
            if (examinee != null) 
            { 
                examinee.CreatedBy = examinee.UpdatedBy = examinee.Name;
                examinee.CreatedOn = DateTime.Now;
                examinee.UpdatedOn = DateTime.Now;
            }            
            var mapper = _config.CreateMapper();
            var dbExaminee = mapper.Map<AppExaminee, Examinee>(examinee);
            var result = Add<Examinee>(dbExaminee);

            return new CrudResult(result.Success, result.Message, result.Success ? ((Examinee)result.Entity).Id : 0);
        }
    }
}
