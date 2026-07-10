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
    [Route("api/citas")]
    [Authorize(Roles = "admin, doctor, receptionist, assistant")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public AppointmentsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cita>>> GetAppointments([FromQuery] DateTime? fecha)
        {
            if (fecha.HasValue)
            {
                var targetDate = fecha.Value.Date;
                var filtered = await _unitOfWork.Citas.FindWithIncludesAsync(c => c.Fecha.Date == targetDate, c => c.Paciente, c => c.Odontologo);
                return Ok(filtered);
            }
            var citas = await _unitOfWork.Citas.GetAllWithIncludesAsync(c => c.Paciente, c => c.Odontologo);
            return Ok(citas);
        }

        [HttpGet("today")]
        public async Task<ActionResult<IEnumerable<Cita>>> GetTodayAppointments()
        {
            var today = DateTime.Today;
            var citas = await _unitOfWork.Citas.FindWithIncludesAsync(c => c.Fecha.Date == today, c => c.Paciente, c => c.Odontologo);
            return Ok(citas);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Cita>> GetAppointment(Guid id)
        {
            var cita = await _unitOfWork.Citas.GetByIdAsync(id);
            if (cita == null)
                return NotFound();
            
            return Ok(cita);
        }

        [HttpPost]
        public async Task<ActionResult<Cita>> CreateAppointment([FromBody] Cita cita)
        {
            if (string.IsNullOrEmpty(cita.Codigo))
            {
                cita.Codigo = "CIT-" + DateTime.Now.ToString("yyMMdd") + "-" + new Random().Next(100, 999);
            }
            await _unitOfWork.Citas.AddAsync(cita);
            await _unitOfWork.CompleteAsync();
            return CreatedAtAction(nameof(GetAppointment), new { id = cita.Id }, cita);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(Guid id, [FromBody] Cita cita)
        {
            if (id != cita.Id) return BadRequest();

            _unitOfWork.Citas.Update(cita);
            await _unitOfWork.CompleteAsync();
            return NoContent();
        }

        [HttpPut("{id}/estado")]
        public async Task<IActionResult> UpdateEstado(Guid id, [FromBody] UpdateEstadoDto dto)
        {
            var appointment = await _unitOfWork.Citas.GetByIdAsync(id);
            if (appointment == null) return NotFound();

            appointment.Estado = dto.Estado;
            _unitOfWork.Citas.Update(appointment);
            await _unitOfWork.CompleteAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin, receptionist")] // Restringimos borrado
        public async Task<IActionResult> DeleteAppointment(Guid id)
        {
            var cita = await _unitOfWork.Citas.GetByIdAsync(id);
            if (cita == null) return NotFound();

            _unitOfWork.Citas.Remove(cita);
            await _unitOfWork.CompleteAsync();
            return NoContent();
        }
    }

    public class UpdateEstadoDto
    {
        public string Estado { get; set; } = string.Empty;
    }
}
