using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Factura
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(20)]
        public string Numero { get; set; } = string.Empty;

        [Required]
        public Guid PacienteId { get; set; }

        [ForeignKey("PacienteId")]
        public Paciente? Paciente { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Descuento { get; set; } = 0.00m;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }

        [Required]
        [StringLength(50)]
        public string MetodoPago { get; set; } = string.Empty;

        [StringLength(20)]
        public string Estado { get; set; } = "pendiente";

        public string? Notas { get; set; }

        public DateTime FechaEmision { get; set; } = DateTime.UtcNow;
        public DateTime? FechaPago { get; set; }

        // Navegación
        public ICollection<FacturaDetalle>? Detalles { get; set; }
    }
}
