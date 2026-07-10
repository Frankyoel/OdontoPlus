namespace backend.Strategies
{
    /// <summary>
    /// [LEGACY] Interfaz original del Patrón Strategy para acceso binario por módulo.
    /// Se mantiene por compatibilidad histórica. Para permisos granulares usar IPermissionStrategy.
    /// </summary>
    public interface IRolePermissionStrategy
    {
        bool CanAccessPatients();
        bool CanAccessAppointments();
        bool CanAccessInventory();
        bool CanAccessBilling();
    }

    // ─── Implementaciones legacy (renombradas para evitar colisión con las nuevas) ───

    /// <summary>[LEGACY] Estrategia binaria para Administrador.</summary>
    public class LegacyAdminPermissionStrategy : IRolePermissionStrategy
    {
        public bool CanAccessPatients()     => true;
        public bool CanAccessAppointments() => true;
        public bool CanAccessInventory()    => true;
        public bool CanAccessBilling()      => true;
    }

    /// <summary>[LEGACY] Estrategia binaria para Odontólogo.</summary>
    public class LegacyDoctorPermissionStrategy : IRolePermissionStrategy
    {
        public bool CanAccessPatients()     => true;
        public bool CanAccessAppointments() => true;
        public bool CanAccessInventory()    => false;
        public bool CanAccessBilling()      => false;
    }

    /// <summary>[LEGACY] Estrategia binaria para Recepcionista.</summary>
    public class LegacyReceptionistPermissionStrategy : IRolePermissionStrategy
    {
        public bool CanAccessPatients()     => true;
        public bool CanAccessAppointments() => true;
        public bool CanAccessInventory()    => false;
        public bool CanAccessBilling()      => true;
    }

    /// <summary>[LEGACY] Estrategia binaria para Asistente Dental.</summary>
    public class LegacyAssistantPermissionStrategy : IRolePermissionStrategy
    {
        public bool CanAccessPatients()     => true;
        public bool CanAccessAppointments() => true;
        public bool CanAccessInventory()    => false;
        public bool CanAccessBilling()      => false;
    }

    /// <summary>[LEGACY] Estrategia binaria para Almacenero.</summary>
    public class LegacyWarehousePermissionStrategy : IRolePermissionStrategy
    {
        public bool CanAccessPatients()     => false;
        public bool CanAccessAppointments() => false;
        public bool CanAccessInventory()    => true;
        public bool CanAccessBilling()      => false;
    }

    /// <summary>
    /// [LEGACY] Contexto que mantiene una referencia a una estrategia de permisos binaria.
    /// Se mantiene por compatibilidad histórica.
    /// </summary>
    public class RolePermissionContext
    {
        private IRolePermissionStrategy _strategy;

        public RolePermissionContext(IRolePermissionStrategy strategy)
        {
            _strategy = strategy;
        }

        public void SetStrategy(IRolePermissionStrategy strategy)
        {
            _strategy = strategy;
        }

        public bool CanAccess(string module)
        {
            return module.ToLower() switch
            {
                "patients"     => _strategy.CanAccessPatients(),
                "appointments" => _strategy.CanAccessAppointments(),
                "inventory"    => _strategy.CanAccessInventory(),
                "billing"      => _strategy.CanAccessBilling(),
                _              => false
            };
        }
    }
}
