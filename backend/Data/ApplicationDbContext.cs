using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    /// <summary>
    /// Contexto de la base de datos que extiende IdentityDbContext para manejar la autenticación de usuarios.
    /// Define los sets de datos (DbSet) para cada entidad y configura las relaciones del modelo.
    /// </summary>
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        // Constructor que inyecta las opciones de configuración para el DbContext.
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<Cita> Citas { get; set; }
        public DbSet<Proveedor> Proveedores { get; set; }
        public DbSet<ArticuloInventario> ArticulosInventario { get; set; }
        public DbSet<HistorialClinico> HistorialesClinicos { get; set; }
        public DbSet<Factura> Facturas { get; set; }
        public DbSet<FacturaDetalle> FacturaDetalles { get; set; }
        public DbSet<RecetaMedica> RecetasMedicas { get; set; }
        public DbSet<RecetaMedicamento> RecetaMedicamentos { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configuraciones adicionales de Entity Framework Core si son necesarias
            builder.Entity<FacturaDetalle>()
                .HasOne(fd => fd.Factura)
                .WithMany(f => f.Detalles)
                .HasForeignKey(fd => fd.FacturaId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<RecetaMedicamento>()
                .HasOne(rm => rm.Receta)
                .WithMany(r => r.Medicamentos)
                .HasForeignKey(rm => rm.RecetaId)
                .OnDelete(DeleteBehavior.Cascade);
                
            builder.Entity<Cita>()
                .HasOne(c => c.Paciente)
                .WithMany(p => p.Citas)
                .HasForeignKey(c => c.PacienteId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
