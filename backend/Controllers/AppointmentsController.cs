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
    [Route("api/[controller]")]
    [Authorize(Roles = "admin, doctor, receptionist, assistant")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public AppointmentsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cita>>> GetAppointments()
        {
            var citas = await _unitOfWork.Citas.GetAllAsync();
            return Ok(citas);
        }

        [HttpGet("{id}")]
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
}
