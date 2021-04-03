using System;
using System.Collections.Generic;
using System.Text;
using Tbh.Online.Test.DAL.Models;

namespace Tbh.Online.Test.DAL.Interfaces
{
    public interface IUserRepository
    {
        User Get(string email, string password);
        User Get(int Id);
    }
}
