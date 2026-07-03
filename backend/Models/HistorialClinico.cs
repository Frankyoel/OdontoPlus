using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class HistorialClinico
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid PacienteId { get; set; }

        [ForeignKey("PacienteId")]
        public Paciente? Paciente { get; set; }

        [Required]
        public string OdontologoId { get; set; } = string.Empty;

        [ForeignKey("OdontologoId")]
        public ApplicationUser? Odontologo { get; set; }

        public DateTime Fecha { get; set; } = DateTime.UtcNow;

        [Required]
        [StringLength(50)]
        public string Tipo { get; set; } = string.Empty;

        [Required]
        public string Descripcion { get; set; } = string.Empty;

        public string? Diagnostico { get; set; }
        public string? Tratamiento { get; set; }
        public string? Notas { get; set; }
    }
}
