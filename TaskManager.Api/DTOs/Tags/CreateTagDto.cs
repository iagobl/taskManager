using System.ComponentModel.DataAnnotations;

namespace TaskManager.Api.DTOs.Tags;

public class CreateTagDto
{
    [Required]
    [MaxLength(80)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(30)]
    public string? Color { get; set; }
}