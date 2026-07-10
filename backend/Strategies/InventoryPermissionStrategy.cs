using System.Collections.Generic;

namespace backend.Strategies
{
    /// <summary>
    /// Estrategia de permisos para el rol Inventario (Almacenero).
    /// Acceso exclusivo al módulo de inventario y compras. Sin acceso a datos clínicos ni financieros.
    /// </summary>
    public class InventoryPermissionStrategy : IPermissionStrategy
    {
        public IEnumerable<string> GetPermissions() => new[]
        {
            // Pacientes — solo consulta (para saber qué materiales se usan)
            SystemPermissions.Patients.View,

            // Inventario — acceso completo incluyendo movimientos de stock
            SystemPermissions.Inventory.View,
            SystemPermissions.Inventory.Create,
            SystemPermissions.Inventory.Edit,
            SystemPermissions.Inventory.StockIn,
            SystemPermissions.Inventory.StockOut,
            SystemPermissions.Inventory.StockAdjust,

            // Compras — puede ver, crear y editar órdenes de compra
            SystemPermissions.Purchases.View,
            SystemPermissions.Purchases.Create,
            SystemPermissions.Purchases.Edit,

            // Reportes — solo de inventario (el frontend filtra por rol)
            SystemPermissions.Reports.View

            // Sin acceso a: Usuarios, Historia Clínica, Odontograma, Tratamientos,
            // Recetas, Facturación, Agenda, Configuración
        };
    }
}
