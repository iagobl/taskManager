using System.ComponentModel.DataAnnotations;

namespace TaskManager.Api.DTOs.Categories;

public class CreateCategoryDto
{
    [Required]
    [MaxLength(80)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(30)]
    public string? Color { get; set; }
}