using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class ArticuloInventario
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [StringLength(50)]
        public string? SKU { get; set; }

        [Required]
        [StringLength(150)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Categoria { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Unidad { get; set; } = string.Empty;

        public int StockActual { get; set; } = 0;
        public int StockMinimo { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioUnitario { get; set; }

        public Guid? ProveedorId { get; set; }

        [ForeignKey("ProveedorId")]
        public Proveedor? Proveedor { get; set; }

        [StringLength(100)]
        public string? Ubicacion { get; set; }

        [StringLength(20)]
        public string? Estado { get; set; }

        public DateTime UltimaActualizacion { get; set; } = DateTime.UtcNow;
    }
}
