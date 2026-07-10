using System.Collections.Generic;

namespace backend.Strategies
{
    /// <summary>
    /// Estrategia de permisos para el rol Odontólogo.
    /// Acceso clínico completo, sin acceso a administración, usuarios o finanzas.
    /// </summary>
    public class DoctorPermissionStrategy : IPermissionStrategy
    {
        public IEnumerable<string> GetPermissions() => new[]
        {
            // Pacientes — puede ver y editar, no crear ni eliminar
            SystemPermissions.Patients.View,
            SystemPermissions.Patients.Edit,

            // Agenda — puede ver y editar sus citas
            SystemPermissions.Appointments.View,
            SystemPermissions.Appointments.Edit,

            // Historia Clínica — acceso completo
            SystemPermissions.ClinicalHistory.View,
            SystemPermissions.ClinicalHistory.Create,
            SystemPermissions.ClinicalHistory.Edit,

            // Odontograma — acceso completo
            SystemPermissions.Odontogram.View,
            SystemPermissions.Odontogram.Edit,

            // Tratamientos — acceso completo
            SystemPermissions.Treatments.View,
            SystemPermissions.Treatments.Create,
            SystemPermissions.Treatments.Edit,

            // Recetas — acceso completo
            SystemPermissions.Prescriptions.View,
            SystemPermissions.Prescriptions.Create,
            SystemPermissions.Prescriptions.Edit,

            // Inventario — solo consulta
            SystemPermissions.Inventory.View,

            // Reportes — solo clínicos (el frontend filtra por rol)
            SystemPermissions.Reports.View

            // Sin acceso a: Usuarios, Configuración, Compras, Facturación
        };
    }
}
