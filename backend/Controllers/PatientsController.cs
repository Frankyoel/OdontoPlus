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
    // Autorización requerida. Roles permitidos (según permissions.js): Admin, Doctor, Receptionist, Assistant
    [Authorize(Roles = "admin, doctor, receptionist, assistant")]
    public class PatientsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public PatientsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Paciente>>> GetPatients()
        {
            var patients = await _unitOfWork.Pacientes.GetAllAsync();
            return Ok(patients);
        }

        // GET: api/patients/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Paciente>> GetPatient(Guid id)
        {
            var patient = await _unitOfWork.Pacientes.GetByIdAsync(id);
            if (patient == null)
            {
                return NotFound();
            }
            return Ok(patient);
        }

        // POST: api/patients
        // Solo Admin y Recepcionista pueden crear pacientes
        [HttpPost]
        [Authorize(Roles = "admin, receptionist")]
        public async Task<ActionResult<Paciente>> CreatePatient([FromBody] Paciente patient)
        {
            await _unitOfWork.Pacientes.AddAsync(patient);
            await _unitOfWork.CompleteAsync();
            
            return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patient);
        }

        // PUT: api/patients/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "admin, receptionist")]
        public async Task<IActionResult> UpdatePatient(Guid id, [FromBody] Paciente patient)
        {
            if (id != patient.Id)
            {
                return BadRequest();
            }

            _unitOfWork.Pacientes.Update(patient);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // DELETE: api/patients/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")] // Solo admin puede eliminar
        public async Task<IActionResult> DeletePatient(Guid id)
        {
            var patient = await _unitOfWork.Pacientes.GetByIdAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            _unitOfWork.Pacientes.Remove(patient);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}
