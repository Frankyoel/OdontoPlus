using System.Collections.Generic;

namespace backend.Strategies
{
    /// <summary>
    /// Estrategia de permisos para el rol Administrador.
    /// Tiene acceso total al sistema.
    /// </summary>
    public class AdminPermissionStrategy : IPermissionStrategy
    {
        public IEnumerable<string> GetPermissions() => new[]
        {
            // Usuarios
            SystemPermissions.Users.View,
            SystemPermissions.Users.Create,
            SystemPermissions.Users.Edit,
            SystemPermissions.Users.Delete,

            // Pacientes
            SystemPermissions.Patients.View,
            SystemPermissions.Patients.Create,
            SystemPermissions.Patients.Edit,
            SystemPermissions.Patients.Delete,

            // Agenda
            SystemPermissions.Appointments.View,
            SystemPermissions.Appointments.Create,
            SystemPermissions.Appointments.Edit,
            SystemPermissions.Appointments.Cancel,

            // Historia Clínica
            SystemPermissions.ClinicalHistory.View,

            // Odontograma
            SystemPermissions.Odontogram.View,

            // Tratamientos
            SystemPermissions.Treatments.View,

            // Recetas
            SystemPermissions.Prescriptions.View,

            // Inventario
            SystemPermissions.Inventory.View,
            SystemPermissions.Inventory.Create,
            SystemPermissions.Inventory.Edit,
            SystemPermissions.Inventory.Delete,
            SystemPermissions.Inventory.StockIn,
            SystemPermissions.Inventory.StockOut,
            SystemPermissions.Inventory.StockAdjust,

            // Compras
            SystemPermissions.Purchases.View,
            SystemPermissions.Purchases.Create,
            SystemPermissions.Purchases.Edit,
            SystemPermissions.Purchases.Delete,

            // Facturación
            SystemPermissions.Billing.View,
            SystemPermissions.Billing.Create,
            SystemPermissions.Billing.Edit,
            SystemPermissions.Billing.Cancel,

            // Reportes
            SystemPermissions.Reports.View,

            // Configuración
            SystemPermissions.Settings.Manage
        };
    }
}
