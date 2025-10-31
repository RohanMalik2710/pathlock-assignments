// Models/User.cs
using System.ComponentModel.DataAnnotations;

namespace ProjectManagerAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required, StringLength(50, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public byte[] PasswordHash { get; set; } = Array.Empty<byte>();

        [Required]
        public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();

        public List<Project> Projects { get; set; } = new();
    }
}
