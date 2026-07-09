using System;
using System.Threading.Tasks;
using backend.Data;

namespace backend.Repositories
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly ApplicationDbContext _context;

        public IRepository<Models.Paciente> Pacientes { get; private set; }
        public IRepository<Models.Cita> Citas { get; private set; }
        public IRepository<Models.ArticuloInventario> Inventario { get; private set; }
        public IRepository<Models.Proveedor> Proveedores { get; private set; }
        public IRepository<Models.HistorialClinico> HistorialesClinicos { get; private set; }
        public IRepository<Models.Factura> Facturas { get; private set; }
        public IRepository<Models.RecetaMedica> RecetasMedicas { get; private set; }

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            Pacientes = new Repository<Models.Paciente>(_context);
            Citas = new Repository<Models.Cita>(_context);
            Inventario = new Repository<Models.ArticuloInventario>(_context);
            Proveedores = new Repository<Models.Proveedor>(_context);
            HistorialesClinicos = new Repository<Models.HistorialClinico>(_context);
            Facturas = new Repository<Models.Factura>(_context);
            RecetasMedicas = new Repository<Models.RecetaMedica>(_context);
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
