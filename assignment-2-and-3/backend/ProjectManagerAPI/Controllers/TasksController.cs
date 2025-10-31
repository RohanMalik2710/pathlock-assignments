// backend/ProjectManagerAPI/Controllers/TasksController.cs
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagerAPI.Data;
using ProjectManagerAPI.Models;
using ProjectManagerAPI.DTOs;

namespace ProjectManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TasksController(AppDbContext db) => _db = db;

        // POST /api/tasks/{projectId}
        [HttpPost("{projectId}")]
        public async Task<IActionResult> AddTask(int projectId, [FromBody] CreateTaskDto dto)
        {
            // verify ownership of project
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
            if (project == null) return NotFound("Project not found or access denied");

            var task = new TaskItem
            {
                Title = dto.Title,
                DueDate = dto.DueDate,
                ProjectId = projectId
            };

            _db.Tasks.Add(task);
            await _db.SaveChangesAsync();

            return Ok(new { task.Id, task.Title, task.IsCompleted, task.DueDate });
        }

        // PUT /api/tasks/{taskId}
        [HttpPut("{taskId}")]
        public async Task<IActionResult> UpdateTask(int taskId, [FromBody] UpdateTaskDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var task = await _db.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == taskId && t.Project!.UserId == userId);
            if (task == null) return NotFound("Task not found");

            if (dto.Title != null) task.Title = dto.Title;
            if (dto.IsCompleted.HasValue) task.IsCompleted = dto.IsCompleted.Value;
            if (dto.DueDate.HasValue) task.DueDate = dto.DueDate.Value;

            await _db.SaveChangesAsync();
            return Ok(new { task.Id, task.Title, task.IsCompleted, task.DueDate });
        }

        // PUT shortcut to toggle complete: /api/tasks/{taskId}/toggle
        [HttpPut("{taskId}/toggle")]
        public async Task<IActionResult> ToggleTask(int taskId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var task = await _db.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == taskId && t.Project!.UserId == userId);
            if (task == null) return NotFound("Task not found");

            task.IsCompleted = !task.IsCompleted;
            await _db.SaveChangesAsync();
            return Ok(new { task.Id, task.IsCompleted });
        }

        // DELETE /api/tasks/{taskId}
        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTask(int taskId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var task = await _db.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == taskId && t.Project!.UserId == userId);
            if (task == null) return NotFound("Task not found");

            _db.Tasks.Remove(task);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // GET /api/tasks/project/{projectId}  (optional convenience)
        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetTasksForProject(int projectId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
            if (project == null) return NotFound("Project not found");

            var tasks = await _db.Tasks
                .Where(t => t.ProjectId == projectId)
                .OrderBy(t => t.IsCompleted)      // incomplete first
                .ThenBy(t => t.DueDate)          // earliest due date first
                .ToListAsync();

            return Ok(tasks);
        }
    }
}
