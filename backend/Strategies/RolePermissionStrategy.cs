namespace backend.Strategies
{
    /// <summary>
    /// Interfaz que define la estrategia de permisos para un rol específico (Patrón Strategy).
    /// </summary>
    public interface IRolePermissionStrategy
    {
        bool CanAccessPatients();
        bool CanAccessAppointments();
        bool CanAccessInventory();
        bool CanAccessBilling();
    }

    /// <summary>
    /// Estrategia concreta de permisos para el rol de Administrador (acceso total).
    /// </summary>
    public class AdminPermissionStrategy : IRolePermissionStrategy
    {
        public bool CanAccessPatients() => true;
        public bool CanAccessAppointments() => true;
        public bool CanAccessInventory() => true;
        public bool CanAccessBilling() => true;
    }

    /// <summary>
    /// Estrategia concreta de permisos para el rol de Odontólogo.
    /// </summary>
    public class DoctorPermissionStrategy : IRolePermissionStrategy
    {
        public bool CanAccessPatients() => true;
        public bool CanAccessAppointments() => true;
        public bool CanAccessInventory() => false;
        public bool CanAccessBilling() => false;
    }

    /// <summary>
    /// Estrategia concreta de permisos para el rol de Recepcionista.
    /// </summary>
    public class ReceptionistPermissionStrategy : IRolePermissionStrategy
    {
        public bool CanAccessPatients() => true;
        public bool CanAccessAppointments() => true;
        public bool CanAccessInventory() => false;
        public bool CanAccessBilling() => true;
    }
    
    /// <summary>
    /// Estrategia concreta de permisos para el rol de Asistente Dental.
    /// </summary>
    public class AssistantPermissionStrategy : IRolePermissionStrategy
    {
        public bool CanAccessPatients() => true;
        public bool CanAccessAppointments() => true;
        public bool CanAccessInventory() => false;
        public bool CanAccessBilling() => false;
    }
    
    /// <summary>
    /// Estrategia concreta de permisos para el rol de Almacenero.
    /// </summary>
    public class WarehousePermissionStrategy : IRolePermissionStrategy
    {
        public bool CanAccessPatients() => false;
        public bool CanAccessAppointments() => false;
        public bool CanAccessInventory() => true;
        public bool CanAccessBilling() => false;
    }

    /// <summary>
    /// Contexto que mantiene una referencia a una de las estrategias de permisos (Patrón Strategy).
    /// </summary>
    public class RolePermissionContext
    {
        private IRolePermissionStrategy _strategy;

        // Constructor que inyecta la estrategia de permisos inicial.
        public RolePermissionContext(IRolePermissionStrategy strategy)
        {
            _strategy = strategy;
        }

        // Permite cambiar dinámicamente la estrategia de permisos en tiempo de ejecución.
        public void SetStrategy(IRolePermissionStrategy strategy)
        {
            _strategy = strategy;
        }

        // Evalúa el acceso al módulo especificado utilizando la estrategia actualmente configurada.
        public bool CanAccess(string module)
        {
            return module.ToLower() switch
            {
                "patients" => _strategy.CanAccessPatients(),
                "appointments" => _strategy.CanAccessAppointments(),
                "inventory" => _strategy.CanAccessInventory(),
                "billing" => _strategy.CanAccessBilling(),
                _ => false
            };
        }
    }
}
