using System.Collections.Generic;

namespace backend.Strategies
{
    /// <summary>
    /// Estrategia de permisos para el rol Recepción.
    /// Gestiona pacientes, agenda y facturación básica. Sin acceso a datos clínicos avanzados.
    /// </summary>
    public class ReceptionPermissionStrategy : IPermissionStrategy
    {
        public IEnumerable<string> GetPermissions() => new[]
        {
            // Pacientes — puede ver, crear y editar; no puede eliminar
            SystemPermissions.Patients.View,
            SystemPermissions.Patients.Create,
            SystemPermissions.Patients.Edit,

            // Agenda — acceso completo
            SystemPermissions.Appointments.View,
            SystemPermissions.Appointments.Create,
            SystemPermissions.Appointments.Edit,
            SystemPermissions.Appointments.Cancel,

            // Historia Clínica — solo consulta
            SystemPermissions.ClinicalHistory.View,

            // Odontograma — solo consulta
            SystemPermissions.Odontogram.View,

            // Recetas — solo consulta
            SystemPermissions.Prescriptions.View,

            // Inventario — solo consulta
            SystemPermissions.Inventory.View,

            // Facturación — puede ver y crear
            SystemPermissions.Billing.View,
            SystemPermissions.Billing.Create,

            // Reportes — solo administrativos (el frontend filtra por rol)
            SystemPermissions.Reports.View

            // Sin acceso a: Usuarios, Configuración, Compras, Historia Clínica avanzada
        };
    }
}
