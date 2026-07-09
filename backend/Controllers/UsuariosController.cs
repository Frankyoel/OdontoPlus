using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsuariosController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UsuariosController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // GET: api/usuarios/odontologos
        [HttpGet("odontologos")]
        public async Task<IActionResult> GetOdontologos()
        {
            var users = await _userManager.GetUsersInRoleAsync("doctor");
            var result = users.Select(u => new
            {
                id = u.Id,
                nombreCompleto = u.UserName,
                email = u.Email,
                rol = "odontologo"
            }).ToList();

            return Ok(result);
        }

        // GET: api/usuarios
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var result = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new
                {
                    id = user.Id,
                    nombreCompleto = user.UserName,
                    email = user.Email,
                    rol = roles.FirstOrDefault() ?? "Sin rol",
                    activo = true // mock status since ASP.NET Identity Lockout could be used
                });
            }

            return Ok(result);
        }
    }
}
