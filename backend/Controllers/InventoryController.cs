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
    [Route("api/inventario")]
    [Authorize(Roles = "admin, warehouse")] // Según roles en DOCUMENTACION.txt
    public class InventoryController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public InventoryController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArticuloInventario>>> GetInventory()
        {
            var inventory = await _unitOfWork.Inventario.GetAllAsync();
            return Ok(inventory);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ArticuloInventario>> GetInventoryItem(Guid id)
        {
            var item = await _unitOfWork.Inventario.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<ArticuloInventario>> CreateInventoryItem([FromBody] ArticuloInventario item)
        {
            await _unitOfWork.Inventario.AddAsync(item);
            await _unitOfWork.CompleteAsync();
            return CreatedAtAction(nameof(GetInventoryItem), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInventoryItem(Guid id, [FromBody] ArticuloInventario item)
        {
            if (id != item.Id) return BadRequest();

            _unitOfWork.Inventario.Update(item);
            await _unitOfWork.CompleteAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteInventoryItem(Guid id)
        {
            var item = await _unitOfWork.Inventario.GetByIdAsync(id);
            if (item == null) return NotFound();

            _unitOfWork.Inventario.Remove(item);
            await _unitOfWork.CompleteAsync();
            return NoContent();
        }
    }
}
