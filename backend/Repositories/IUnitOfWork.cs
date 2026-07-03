using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IUnitOfWork
    {
        IRepository<Models.Paciente> Pacientes { get; }
        IRepository<Models.Cita> Citas { get; }
        IRepository<Models.ArticuloInventario> Inventario { get; }
        IRepository<Models.HistorialClinico> HistorialesClinicos { get; }
        IRepository<Models.Factura> Facturas { get; }
        IRepository<Models.RecetaMedica> RecetasMedicas { get; }
        
        Task<int> CompleteAsync();
        void Dispose();
    }
}
