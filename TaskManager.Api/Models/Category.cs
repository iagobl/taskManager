namespace TaskManager.Api.Models;

public class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Color { get; set; }

    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}