namespace TaskManager.Api.DTOs.Tasks;

public class TaskDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsCompleted { get; set; }

    public string Priority { get; set; } = string.Empty;

    public DateTime? DueDate { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public int ProjectId { get; set; }

    public int? CategoryId { get; set; }
}