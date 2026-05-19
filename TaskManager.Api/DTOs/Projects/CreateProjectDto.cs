using System.ComponentModel.DataAnnotations;

namespace TaskManager.Api.DTOs.Projects;

public class CreateProjectDto
{
    [Required]
    [MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }
}