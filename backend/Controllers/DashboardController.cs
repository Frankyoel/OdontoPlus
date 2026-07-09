using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Repositories;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public DashboardController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/dashboard/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var hoy = DateTime.Now.Date;
            
            var citas = await _unitOfWork.Citas.GetAllAsync();
            var citasHoy = citas.Where(c => c.Fecha.Date == hoy).ToList();
            var citasProgramadasHoy = citasHoy.Count(c => c.Estado == "programada" || c.Estado == "confirmada");
            var totalCitasMes = citas.Count(c => c.Fecha.Month == hoy.Month && c.Fecha.Year == hoy.Year);

            var pacientes = await _unitOfWork.Pacientes.GetAllAsync();
            var totalPacientes = pacientes.Count();

            var facturas = await _unitOfWork.Facturas.GetAllAsync();
            
            // Calcular ingresos reales del día
            var facturasPagadasHoy = facturas.Where(f => f.FechaEmision.Date == hoy && f.Estado == "pagada");
            decimal ingresosHoy = facturasPagadasHoy.Sum(f => f.Total);

            // Calcular ingresos de los últimos 6 días + hoy
            var ingresosSemana = new List<object>();
            for (int i = 6; i >= 0; i--)
            {
                var dia = hoy.AddDays(-i);
                var totalDia = facturas
                    .Where(f => f.FechaEmision.Date == dia && f.Estado == "pagada")
                    .Sum(f => f.Total);
                
                ingresosSemana.Add(new { 
                    dia = dia.ToString("dddd", new System.Globalization.CultureInfo("es-ES")), 
                    total = totalDia 
                });
            }

            var inventario = await _unitOfWork.Inventario.GetAllAsync();
            var itemsCriticos = inventario.Count(i => i.StockActual <= i.StockMinimo);
            var itemsBajos = inventario.Count(i => i.StockActual > i.StockMinimo && i.StockActual <= i.StockMinimo * 2);

            var facturasPendientes = facturas.Count(f => f.Estado == "pendiente");

            return Ok(new
            {
                ingresosHoy,
                totalCitasMes,
                citasProgramadasHoy,
                citasHoy = citasHoy.Count,
                totalPacientes,
                itemsCriticos,
                itemsBajos,
                totalArticulos = inventario.Count(),
                facturasPendientes,
                ingresosSemana
            });
        }
    }
}
