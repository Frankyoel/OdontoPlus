using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Repositories;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/historial")]
    [Authorize(Roles = "admin, doctor")]
    public class ClinicalHistoryController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public ClinicalHistoryController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HistorialClinico>>> GetHistories([FromQuery] Guid? pacienteId)
        {
            if (pacienteId.HasValue)
            {
                var historiales = await _unitOfWork.HistorialesClinicos.FindAsync(h => h.PacienteId == pacienteId.Value);
                return Ok(historiales);
            }
            var todos = await _unitOfWork.HistorialesClinicos.GetAllAsync();
            return Ok(todos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HistorialClinico>> GetHistory(Guid id)
        {
            var historial = await _unitOfWork.HistorialesClinicos.GetByIdAsync(id);
            if (historial == null) return NotFound();
            return Ok(historial);
        }

        [HttpPost]
        public async Task<ActionResult<HistorialClinico>> CreateHistory([FromBody] HistorialClinico historial)
        {
            await _unitOfWork.HistorialesClinicos.AddAsync(historial);
            await _unitOfWork.CompleteAsync();
            return CreatedAtAction(nameof(GetHistory), new { id = historial.Id }, historial);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHistory(Guid id, [FromBody] HistorialClinico historial)
        {
            if (id != historial.Id) return BadRequest();

            _unitOfWork.HistorialesClinicos.Update(historial);
            await _unitOfWork.CompleteAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")] // Solo el admin borra registros clínicos
        public async Task<IActionResult> DeleteHistory(Guid id)
        {
            var historial = await _unitOfWork.HistorialesClinicos.GetByIdAsync(id);
            if (historial == null) return NotFound();

            _unitOfWork.HistorialesClinicos.Remove(historial);
            await _unitOfWork.CompleteAsync();
            return NoContent();
        }
    }
}
