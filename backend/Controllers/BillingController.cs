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
    [Route("api/facturas")]
    [Authorize(Roles = "admin, receptionist")] // Según DOCUMENTACION.txt
    public class BillingController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public BillingController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Factura>>> GetInvoices()
        {
            var facturas = await _unitOfWork.Facturas.GetAllAsync();
            return Ok(facturas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Factura>> GetInvoice(Guid id)
        {
            var factura = await _unitOfWork.Facturas.GetByIdAsync(id);
            if (factura == null) return NotFound();
            return Ok(factura);
        }

        [HttpPost]
        public async Task<ActionResult<Factura>> CreateInvoice([FromBody] Factura factura)
        {
            await _unitOfWork.Facturas.AddAsync(factura);
            await _unitOfWork.CompleteAsync();
            return CreatedAtAction(nameof(GetInvoice), new { id = factura.Id }, factura);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoice(Guid id, [FromBody] Factura factura)
        {
            if (id != factura.Id) return BadRequest();

            _unitOfWork.Facturas.Update(factura);
            await _unitOfWork.CompleteAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteInvoice(Guid id)
        {
            var factura = await _unitOfWork.Facturas.GetByIdAsync(id);
            if (factura == null) return NotFound();

            _unitOfWork.Facturas.Remove(factura);
            await _unitOfWork.CompleteAsync();
            return NoContent();
        }
    }
}
