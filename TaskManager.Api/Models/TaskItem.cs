namespace TaskManager.Api.Models;

public class TaskItem
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsCompleted { get; set; } = false;

    public string Priority { get; set; } = "Medium";

    public DateTime? DueDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedAt { get; set; }

    public int ProjectId { get; set; }

    public Project Project { get; set; } = null!;

    public int? CategoryId { get; set; }

    public Category? Category { get; set; }

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public ICollection<TaskTag> TaskTags { get; set; } = new List<TaskTag>();
}