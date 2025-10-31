using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagerAPI.Data;
using ProjectManagerAPI.DTOs;
using ProjectManagerAPI.Models;
using ProjectManagerAPI.Services;

namespace ProjectManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly SchedulerService _scheduler;

        public ProjectsController(AppDbContext db, SchedulerService scheduler)
        {
            _db = db;
            _scheduler = scheduler;
        }

        // GET: api/projects
        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var projects = await _db.Projects
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new { p.Id, p.Title, p.Description, p.CreatedAt })
                .ToListAsync();

            return Ok(projects);
        }

        // POST: api/projects
        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] CreateProjectDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var project = new Project
            {
                Title = dto.Title,
                Description = dto.Description,
                UserId = userId
            };

            _db.Projects.Add(project);
            await _db.SaveChangesAsync();

            return Ok(new { project.Id, project.Title, project.Description, project.CreatedAt });
        }

        // GET: api/projects/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var project = await _db.Projects
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

            if (project == null) return NotFound();

            return Ok(new
            {
                project.Id,
                project.Title,
                project.Description,
                project.CreatedAt,
                tasks = project.Tasks
                    .OrderBy(t => t.IsCompleted)
                    .ThenBy(t => t.DueDate)
                    .Select(t => new { t.Id, t.Title, t.IsCompleted, t.DueDate })
            });
        }

        // DELETE: api/projects/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
            if (project == null) return NotFound();

            _db.Projects.Remove(project);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/projects/v1/{projectId}/schedule
        [HttpPost("v1/{projectId}/schedule")]
        public async Task<IActionResult> Schedule(int projectId, [FromBody] SchedulerRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var project = await _db.Projects
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
                return NotFound("Project not found");

            // Use provided tasks if sent; otherwise fallback to DB tasks
            var inputTasks = (request?.Tasks?.Any() ?? false)
                ? request.Tasks.Select(t => new SchedulerService.SchedulerInputTask
                {
                    Title = t.Title,
                    EstimatedHours = t.EstimatedHours,
                    DueDate = t.DueDate,
                    Dependencies = t.Dependencies
                }).ToList()
                : project.Tasks.Select(t => new SchedulerService.SchedulerInputTask
                {
                    Title = t.Title,
                    DueDate = t.DueDate,
                    Dependencies = new List<string>()
                }).ToList();

            var ordered = _scheduler.RecommendOrderByDueDateAndDependencies(inputTasks);

            return Ok(new { recommendedOrder = ordered });
        }
    }

    // --- Nested DTOs for Scheduler ---
    public class SchedulerRequest
    {
        public List<SchedulerInputDto>? Tasks { get; set; }
    }

    public class SchedulerInputDto
    {
        public string Title { get; set; } = string.Empty;
        public int? EstimatedHours { get; set; }
        public DateTime? DueDate { get; set; }
        public List<string>? Dependencies { get; set; }
    }
}
