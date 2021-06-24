using System;
using System.Collections.Generic;
using System.Text;
using Tbh.Online.Test.Model.App;

namespace Tbh.Online.Test.Service.Interfaces
{
    public interface IUserService
    {
        AppUser Get(string email, string password);
        List<AppUserListItem> GetUsers(string email);
        AppUser Get(int id);
        AppUser GetByEmail(string email);
        CrudResult Save(AppUser user);
    }
}
