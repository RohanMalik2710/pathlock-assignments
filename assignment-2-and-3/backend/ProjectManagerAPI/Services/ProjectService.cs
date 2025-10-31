// Services/ProjectService.cs
using Microsoft.EntityFrameworkCore;
using ProjectManagerAPI.Data;
using ProjectManagerAPI.DTOs;
using ProjectManagerAPI.Models;

namespace ProjectManagerAPI.Services
{
    public class ProjectService
    {
        private readonly AppDbContext _db;
        public ProjectService(AppDbContext db) => _db = db;

        public async Task<List<ProjectListDto>> GetProjectsForUserAsync(int userId)
        {
            return await _db.Projects
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new ProjectListDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    CreatedAt = p.CreatedAt
                }).ToListAsync();
        }

        public async Task<Project?> GetProjectByIdAsync(int id, int userId)
        {
            return await _db.Projects.Include(p => p.Tasks)
                       .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        }

        public async Task<Project> CreateProjectAsync(CreateProjectDto dto, int userId)
        {
            var project = new Project
            {
                Title = dto.Title,
                Description = dto.Description,
                UserId = userId
            };
            _db.Projects.Add(project);
            await _db.SaveChangesAsync();
            return project;
        }

        public async Task<bool> DeleteProjectAsync(int id, int userId)
        {
            var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
            if (project == null) return false;
            _db.Projects.Remove(project);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
