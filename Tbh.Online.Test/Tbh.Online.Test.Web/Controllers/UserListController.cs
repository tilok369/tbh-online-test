using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tbh.Online.Test.Model.App;
using Tbh.Online.Test.Service.Interfaces;

namespace Tbh.Online.Test.Web.Controllers
{
    [Route("api/v{version:apiVersion}/User")]
    [ApiController]
    public class UserListController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserListController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("userList")]
        public ActionResult<List<AppUserListItem>> GetUserList()
        {
            var data = _userService.GetUsers();
            return Ok(data);
        }

        [HttpGet("user") ]
        public ActionResult<AppUser> GetUser(int id)
        {
            var data = _userService.Get(id);
            return Ok(data);
        }

        [HttpPost()]
        public ActionResult<CrudResult> EditUser(AppUser user)
        {
            if (user == null) return Ok(new CrudResult(false, "No such user!"));

            user.UpdatedOn = DateTime.Now;
            user.UpdatedBy = User.Identity.Name;
            var data = _userService.Save(user);
            
            return Ok(data);
        }

    }
}
