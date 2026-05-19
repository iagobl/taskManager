namespace TaskManager.Api.Models;

public class Tag
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Color { get; set; }

    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public ICollection<TaskTag> TaskTags { get; set; } = new List<TaskTag>();
}