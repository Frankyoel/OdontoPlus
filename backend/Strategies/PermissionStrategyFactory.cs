using System;

namespace backend.Strategies
{
    /// <summary>
    /// Factory que instancia la estrategia de permisos correcta dado el nombre del rol.
    /// Para agregar un nuevo rol, solo se añade un caso aquí y se crea la estrategia concreta.
    /// Los controladores y el resto del sistema no requieren ningún cambio.
    /// </summary>
    public static class PermissionStrategyFactory
    {
        /// <summary>
        /// Crea y devuelve la estrategia de permisos correspondiente al rol indicado.
        /// </summary>
        /// <param name="role">Nombre del rol tal como está registrado en ASP.NET Identity (ej. "admin", "doctor").</param>
        /// <returns>Una instancia de <see cref="IPermissionStrategy"/> para el rol indicado.</returns>
        /// <exception cref="ArgumentException">Se lanza si el rol no tiene una estrategia registrada.</exception>
        public static IPermissionStrategy Create(string role) => role?.ToLower() switch
        {
            "admin"        => new AdminPermissionStrategy(),
            "doctor"       => new DoctorPermissionStrategy(),
            "receptionist" => new ReceptionPermissionStrategy(),
            "warehouse"    => new InventoryPermissionStrategy(),

            // Roles legacy — mantenidos por compatibilidad con registros existentes
            "assistant"    => new ReceptionPermissionStrategy(), // mismos permisos que recepción

            _ => throw new ArgumentException($"No existe una estrategia de permisos para el rol: '{role}'")
        };
    }
}
