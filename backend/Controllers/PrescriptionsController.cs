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
    [Authorize(Roles = "admin, doctor")]
    public class PrescriptionsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public PrescriptionsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecetaMedica>>> GetPrescriptions()
        {
            var recetas = await _unitOfWork.RecetasMedicas.GetAllAsync();
            return Ok(recetas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RecetaMedica>> GetPrescription(Guid id)
        {
            var receta = await _unitOfWork.RecetasMedicas.GetByIdAsync(id);
            if (receta == null) return NotFound();
            return Ok(receta);
        }

        [HttpPost]
        public async Task<ActionResult<RecetaMedica>> CreatePrescription([FromBody] RecetaMedica receta)
        {
            await _unitOfWork.RecetasMedicas.AddAsync(receta);
            await _unitOfWork.CompleteAsync();
            return CreatedAtAction(nameof(GetPrescription), new { id = receta.Id }, receta);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePrescription(Guid id, [FromBody] RecetaMedica receta)
        {
            if (id != receta.Id) return BadRequest();

            _unitOfWork.RecetasMedicas.Update(receta);
            await _unitOfWork.CompleteAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeletePrescription(Guid id)
        {
            var receta = await _unitOfWork.RecetasMedicas.GetByIdAsync(id);
            if (receta == null) return NotFound();

            _unitOfWork.RecetasMedicas.Remove(receta);
            await _unitOfWork.CompleteAsync();
            return NoContent();
        }
    }
}
