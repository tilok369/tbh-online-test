using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tbh.Online.Test.Service.Interfaces;

namespace Tbh.Online.Test.Web.Controllers
{
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        public IActionResult UserList()
        {
            var user = _userService.GetByEmail(User.Identity.Name);
            ViewBag.Role = user.RoleId;
            return View();
        }

        public IActionResult Edit(int userId)
        {
            var user = _userService.GetByEmail(User.Identity.Name);
            ViewBag.Role = user.RoleId;
            ViewBag.UserId = userId;
            return View();
        }
        public IActionResult CreateUser()
        {
            return View();
        }
    }
}
