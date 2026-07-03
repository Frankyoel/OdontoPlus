using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Paciente
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(20)]
        public string Codigo { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Apellido { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string DNI { get; set; } = string.Empty;

        public DateTime FechaNacimiento { get; set; }
        
        [StringLength(1)]
        public string? Sexo { get; set; }
        
        [StringLength(20)]
        public string? Telefono { get; set; }
        
        [StringLength(150)]
        public string? Email { get; set; }
        
        public string? Direccion { get; set; }
        
        [StringLength(5)]
        public string? TipoSangre { get; set; }
        
        public string? Alergias { get; set; }
        public string? Observaciones { get; set; }
        
        public bool Activo { get; set; } = true;
        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
        public DateTime? UltimaVisita { get; set; }

        // Navegación
        public ICollection<Cita>? Citas { get; set; }
        public ICollection<HistorialClinico>? Historial { get; set; }
        public ICollection<Factura>? Facturas { get; set; }
        public ICollection<RecetaMedica>? Recetas { get; set; }
    }
}
