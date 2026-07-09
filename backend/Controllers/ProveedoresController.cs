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
    [Route("api/proveedores")]
    [Authorize(Roles = "admin, warehouse")]
    public class ProveedoresController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProveedoresController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Proveedor>>> GetProveedores()
        {
            var proveedores = await _unitOfWork.Proveedores.GetAllAsync();
            return Ok(proveedores);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Proveedor>> GetProveedor(Guid id)
        {
            var proveedor = await _unitOfWork.Proveedores.GetByIdAsync(id);
            if (proveedor == null) return NotFound();
            return Ok(proveedor);
        }

        [HttpPost]
        public async Task<ActionResult<Proveedor>> CreateProveedor([FromBody] Proveedor proveedor)
        {
            await _unitOfWork.Proveedores.AddAsync(proveedor);
            await _unitOfWork.CompleteAsync();
            return CreatedAtAction(nameof(GetProveedor), new { id = proveedor.Id }, proveedor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProveedor(Guid id, [FromBody] Proveedor proveedor)
        {
            if (id != proveedor.Id) return BadRequest();

            _unitOfWork.Proveedores.Update(proveedor);
            await _unitOfWork.CompleteAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteProveedor(Guid id)
        {
            var proveedor = await _unitOfWork.Proveedores.GetByIdAsync(id);
            if (proveedor == null) return NotFound();

            _unitOfWork.Proveedores.Remove(proveedor);
            await _unitOfWork.CompleteAsync();
            return NoContent();
        }
    }
}
