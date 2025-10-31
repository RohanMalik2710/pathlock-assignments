// DTOs/TaskDtos.cs
using System.ComponentModel.DataAnnotations;

namespace ProjectManagerAPI.DTOs
{
    public class CreateTaskDto
    {
        [Required, StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }
    }

    public class UpdateTaskDto
    {
        public string? Title { get; set; }
        public bool? IsCompleted { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
