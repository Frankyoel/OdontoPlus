using System.Text;
using backend.Data;
using backend.Models;
using backend.Repositories;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configuración de la Base de Datos (MySQL con Pomelo)
var mySqlConnection = builder.Configuration.GetConnectionString("MySqlConnection")
    ?? throw new InvalidOperationException("La cadena de conexión 'MySqlConnection' no está configurada.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        mySqlConnection,
        new MySqlServerVersion(new Version(8, 0, 0))
    )
);

// Configuración de Identity con políticas de contraseña relajadas para permitir credenciales demo
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 4;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Configuración de JWT
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? "OdontoPlusSecretKey1234567890!_MuySegura_123");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Solo para desarrollo
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// Patrón Singleton
builder.Services.AddSingleton<GlobalSettingsService>();

// Patrón de Repositorio
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Configuración CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSPA",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Ejecutar Data Seeder
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    
    // Crear Roles
    string[] roles = new[] { "admin", "doctor", "receptionist", "assistant", "warehouse" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    // Método local para crear usuario semilla
    async Task SeedUser(string email, string name, string role, string password)
    {
        if (await userManager.FindByEmailAsync(email) == null)
        {
            var user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true,
                Activo = true
            };
            var result = await userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, role);
            }
        }
    }

    await SeedUser("admin@odontoplus.pe", "Administrador", "admin", "admin123");
    await SeedUser("dra.torres@odontoplus.pe", "Dra. Torres", "doctor", "doctor123");
    await SeedUser("recepcion@odontoplus.pe", "Recepcionista", "receptionist", "recepcion123");
    await SeedUser("lucia.paredes@odontoplus.pe", "Lucía Paredes", "assistant", "asistente123");
    await SeedUser("almacen@odontoplus.pe", "Almacenero", "warehouse", "almacen123");
}

app.UseRouting();

// Habilitar CORS
app.UseCors("AllowSPA");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
