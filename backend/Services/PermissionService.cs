using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using backend.Strategies;

namespace backend.Services
{
    /// <summary>
    /// Servicio centralizado de evaluación de permisos.
    /// Permite a los controladores consultar si el usuario autenticado tiene un permiso específico
    /// sin necesidad de conocer los roles directamente.
    /// </summary>
    public class PermissionService
    {
        /// <summary>
        /// Verifica si el usuario autenticado tiene un permiso específico del sistema.
        /// Lee el rol del usuario desde sus claims y resuelve los permisos mediante el Patrón Strategy.
        /// </summary>
        /// <param name="user">El ClaimsPrincipal del usuario autenticado (disponible en controladores como 'User').</param>
        /// <param name="permission">El permiso a verificar, definido como constante en <see cref="SystemPermissions"/>.</param>
        /// <returns>true si el usuario posee el permiso; false en caso contrario.</returns>
        public static bool HasPermission(ClaimsPrincipal user, string permission)
        {
            if (user == null) return false;

            var role = user.FindFirstValue(ClaimTypes.Role);
            if (string.IsNullOrEmpty(role)) return false;

            try
            {
                var strategy = PermissionStrategyFactory.Create(role);
                return strategy.GetPermissions().Contains(permission, StringComparer.OrdinalIgnoreCase);
            }
            catch (ArgumentException)
            {
                // Rol desconocido — denegar acceso por defecto
                return false;
            }
        }

        /// <summary>
        /// Devuelve la lista completa de permisos del usuario autenticado.
        /// Útil para construir respuestas de login o auditoría.
        /// </summary>
        /// <param name="role">Nombre del rol tal como está registrado en Identity.</param>
        /// <returns>Colección de strings con los permisos del rol.</returns>
        public static IEnumerable<string> GetPermissionsForRole(string role)
        {
            try
            {
                return PermissionStrategyFactory.Create(role).GetPermissions();
            }
            catch (ArgumentException)
            {
                return Enumerable.Empty<string>();
            }
        }
    }
}
