using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class RecetaMedica
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

        public string? Indicaciones { get; set; }

        public DateTime Fecha { get; set; } = DateTime.UtcNow;

        public bool Firmada { get; set; } = true;

        // Navegación
        public ICollection<RecetaMedicamento>? Medicamentos { get; set; }
    }
}
