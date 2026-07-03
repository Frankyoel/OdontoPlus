using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class RecetaMedicamento
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid RecetaId { get; set; }

        [ForeignKey("RecetaId")]
        public RecetaMedica? Receta { get; set; }

        [Required]
        [StringLength(150)]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Dosis { get; set; }

        [StringLength(100)]
        public string? Frecuencia { get; set; }

        [StringLength(100)]
        public string? Duracion { get; set; }

        public string? Instrucciones { get; set; }
    }
}
