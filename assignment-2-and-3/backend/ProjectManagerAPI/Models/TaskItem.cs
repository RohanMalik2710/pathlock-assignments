// backend/ProjectManagerAPI/Models/TaskItem.cs
using System;
using System.ComponentModel.DataAnnotations;

namespace ProjectManagerAPI.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        [Required, StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public bool IsCompleted { get; set; } = false;

        // NEW: due date for scheduler and display
        public DateTime? DueDate { get; set; }

        public int ProjectId { get; set; }
        public Project? Project { get; set; }
    }
}
