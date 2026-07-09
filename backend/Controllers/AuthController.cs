using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using backend.Models;
using backend.Strategies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    /// <summary>
    /// Controlador encargado del proceso de autenticación y autorización (Login) de los usuarios.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;

        // Constructor que inyecta los servicios de ASP.NET Core Identity y la configuración de la app.
        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        // Endpoint de inicio de sesión. Valida credenciales, genera el JWT y determina la matriz de permisos
        // resolviendo dinámicamente la estrategia mediante el Patrón Strategy.
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null || !user.Activo)
                return Unauthorized(new { message = "Credenciales inválidas o usuario inactivo" });

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded)
                return Unauthorized(new { message = "Credenciales inválidas" });

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.Count > 0 ? roles[0] : "";

            // Determinar estrategia de permisos (Patrón Strategy)
            IRolePermissionStrategy strategy = role switch
            {
                "admin" => new AdminPermissionStrategy(),
                "doctor" => new DoctorPermissionStrategy(),
                "receptionist" => new ReceptionistPermissionStrategy(),
                "assistant" => new AssistantPermissionStrategy(),
                "warehouse" => new WarehousePermissionStrategy(),
                _ => throw new Exception("Rol desconocido")
            };

            var permissionContext = new RolePermissionContext(strategy);
            var permissions = new
            {
                // El dashboard es siempre accesible para usuarios autenticados
                dashboard = new { ver = true }, 
                pacientes = new
                {
                    ver = permissionContext.CanAccess("patients"),
                    crear = strategy is AdminPermissionStrategy || strategy is ReceptionistPermissionStrategy,
                    editar = strategy is AdminPermissionStrategy || strategy is DoctorPermissionStrategy,
                    eliminar = strategy is AdminPermissionStrategy
                },
                agenda = new { ver = permissionContext.CanAccess("appointments") },
                inventario = new { ver = permissionContext.CanAccess("inventory") },
                facturacion = new { ver = permissionContext.CanAccess("billing") },
                reportes = new { ver = strategy is not WarehousePermissionStrategy && strategy is not AssistantPermissionStrategy },
                configuracion = new { ver = strategy is AdminPermissionStrategy }
            };

            var token = GenerateJwtToken(user, role);

            return Ok(new
            {
                token,
                user = new
                {
                    userId = user.Id,
                    nombre = user.UserName,
                    email = user.Email,
                    rol = role
                },
                permissions
            });
        }

        // Genera el token de seguridad firmado digitalmente (JWT) con los claims correspondientes del usuario.
        private string GenerateJwtToken(ApplicationUser user, string role)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(Convert.ToDouble(jwtSettings["ExpireDays"])),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
