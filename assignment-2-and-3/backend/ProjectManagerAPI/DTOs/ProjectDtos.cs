// DTOs/ProjectDtos.cs
using System.ComponentModel.DataAnnotations;

namespace ProjectManagerAPI.DTOs
{
    public class CreateProjectDto
    {
        [Required, StringLength(100, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }
    }

    public class ProjectListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
