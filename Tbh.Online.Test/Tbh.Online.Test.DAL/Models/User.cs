using System;
using System.Collections.Generic;

#nullable disable

namespace Tbh.Online.Test.DAL.Models
{
    public partial class User
    {
        public User()
        {
            ExamineeScores = new HashSet<ExamineeScore>();
        }

        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; }
        public bool Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }

        public virtual Role Role { get; set; }
        public virtual ICollection<ExamineeScore> ExamineeScores { get; set; }
    }
}
