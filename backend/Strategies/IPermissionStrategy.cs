using System.Collections.Generic;

namespace backend.Strategies
{
    /// <summary>
    /// Nueva interfaz del Patrón Strategy para permisos granulares.
    /// Cada estrategia concreta devuelve la lista de permisos que corresponden a su rol.
    /// Para agregar un nuevo rol, solo se crea una nueva clase que implemente esta interfaz.
    /// </summary>
    public interface IPermissionStrategy
    {
        /// <summary>
        /// Devuelve la colección de permisos del rol representado por esta estrategia.
        /// Los permisos son strings con formato "Modulo.Accion" definidos en SystemPermissions.
        /// </summary>
        IEnumerable<string> GetPermissions();
    }
}
