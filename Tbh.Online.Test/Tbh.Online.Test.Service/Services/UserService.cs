using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using Tbh.Online.Test.DAL.Interfaces;
using Tbh.Online.Test.DAL.Models;
using Tbh.Online.Test.DAL.Repositories;
using Tbh.Online.Test.Model.App;
using Tbh.Online.Test.Service.Interfaces;

namespace Tbh.Online.Test.Service.Services
{

    public class UserService: IUserService
    {
        private IUserRepository _userRepository;
        private readonly MapperConfiguration _config;
        public UserService(string connectionString)
        {
            _userRepository = new UserRepository(connectionString);
            _config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<User, AppUser>();
            });
        }

        public AppUser Get(string email, string password)
        {
            var mapper = _config.CreateMapper();
            var user = mapper.Map<User, AppUser>(_userRepository.Get(email, password));
            return user;
        }
    }
}
