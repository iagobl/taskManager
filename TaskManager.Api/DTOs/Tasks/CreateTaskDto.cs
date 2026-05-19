using System.ComponentModel.DataAnnotations;

namespace TaskManager.Api.DTOs.Tasks;

public class CreateTaskDto
{
    [Required]
    [MaxLength(160)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    [MaxLength(30)]
    public string Priority { get; set; } = "Medium";

    public DateTime? DueDate { get; set; }

    public int? CategoryId { get; set; }
}