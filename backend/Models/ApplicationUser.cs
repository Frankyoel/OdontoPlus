using System;
using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? Especialidad { get; set; }
        public string? Consultorio { get; set; }
        public string? Avatar { get; set; }
        public bool Activo { get; set; } = true;
    }
}
