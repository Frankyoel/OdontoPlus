using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Cita
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(20)]
        public string Codigo { get; set; } = string.Empty;

        [Required]
        public Guid PacienteId { get; set; }
        
        [ForeignKey("PacienteId")]
        public Paciente? Paciente { get; set; }

        [Required]
        public string OdontologoId { get; set; } = string.Empty;
        
        [ForeignKey("OdontologoId")]
        public ApplicationUser? Odontologo { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        [Required]
        public TimeSpan HoraInicio { get; set; }

        [Required]
        public TimeSpan HoraFin { get; set; }

        [Required]
        [StringLength(50)]
        public string Tipo { get; set; } = string.Empty;

        [StringLength(50)]
        public string? Consultorio { get; set; }

        [StringLength(50)]
        public string Estado { get; set; } = "programada";

        public string? Notas { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    }
}
