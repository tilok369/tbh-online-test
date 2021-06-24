using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Tbh.Online.Test.DAL.Interfaces;
using Tbh.Online.Test.DAL.Models;

namespace Tbh.Online.Test.DAL.Repositories
{
    public class UserRepository: IUserRepository
    {
        private readonly DbContextOptionsBuilder<OnlineTestContext> _dbContextOptionBuilder;


        public UserRepository(string connectionString)
        {
            _dbContextOptionBuilder = new DbContextOptionsBuilder<OnlineTestContext>();
            _dbContextOptionBuilder.UseSqlServer(connectionString);
        }

        public User Get(string email, string password)
        {
            using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
            {
                return context.Users.FirstOrDefault(u => u.Email.Equals(email) && u.Password.Equals(password));
            }
        }

        public User Get(int Id)
        {
            using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
            {
                return context.Users.FirstOrDefault(u => u.Id == Id);
            }
        }

        public List<User> GetAll()
        {
            using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
            {
                return context.Users.OrderBy(e => e.CreatedOn).ToList();
            }
        }

        public User GetByEmail(string email)
        {
            using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
            {
                return context.Users.FirstOrDefault(u => u.Email.Equals(email));
            }
        }

        public bool Save(User user)
        {

            try
            {
                using (var context = new OnlineTestContext(_dbContextOptionBuilder.Options))
                {
                    if (user.Id == 0)
                    {
                        context.Users.Add(user);
                        context.SaveChanges();
                    }
                    else
                    {
                        context.Entry(user).State = EntityState.Modified;
                        context.SaveChanges();
                    }
                    return true;
                }
            }
            catch (Exception)
            {

                return false;
            }
        }
    }
}
