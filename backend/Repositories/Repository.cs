using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Repositories
{
    /// <summary>
    /// Implementación concreta del repositorio genérico (Patrón de Diseño Repository).
    /// Abstrae el acceso a datos para cualquier entidad mediante Entity Framework Core.
    /// </summary>
    /// <typeparam name="T">El tipo de la entidad.</typeparam>
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _context;
        internal DbSet<T> dbSet;

        // Constructor que inyecta el contexto de base de datos y obtiene el DbSet correspondiente.
        public Repository(ApplicationDbContext context)
        {
            _context = context;
            this.dbSet = _context.Set<T>();
        }

        // Obtiene todos los registros de la entidad de forma asíncrona.
        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await dbSet.ToListAsync();
        }

        public async Task<IEnumerable<T>> GetAllWithIncludesAsync(params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = dbSet;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            return await query.ToListAsync();
        }

        // Obtiene un único registro por su identificador único (ID).
        public async Task<T?> GetByIdAsync(Guid id)
        {
            return await dbSet.FindAsync(id);
        }

        // Busca registros que cumplan con una condición específica (predicado).
        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await dbSet.Where(predicate).ToListAsync();
        }

        public async Task<IEnumerable<T>> FindWithIncludesAsync(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = dbSet;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            return await query.Where(predicate).ToListAsync();
        }

        // Registra una nueva entidad en el contexto de base de datos de manera asíncrona.
        public async Task AddAsync(T entity)
        {
            await dbSet.AddAsync(entity);
        }

        // Marca una entidad existente como modificada en el contexto.
        public void Update(T entity)
        {
            dbSet.Update(entity);
        }

        // Elimina un registro del contexto.
        public void Remove(T entity)
        {
            dbSet.Remove(entity);
        }
    }
}
