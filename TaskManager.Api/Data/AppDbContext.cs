using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Models;

namespace TaskManager.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<TaskTag> TaskTags => Set<TaskTag>();
    public DbSet<Comment> Comments => Set<Comment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .Property(u => u.FullName)
            .HasMaxLength(120)
            .IsRequired();

        modelBuilder.Entity<User>()
            .Property(u => u.Email)
            .HasMaxLength(160)
            .IsRequired();

        modelBuilder.Entity<User>()
            .Property(u => u.PasswordHash)
            .IsRequired();

        // Project
        modelBuilder.Entity<Project>()
            .Property(p => p.Name)
            .HasMaxLength(120)
            .IsRequired();

        modelBuilder.Entity<Project>()
            .Property(p => p.Description)
            .HasMaxLength(500);

        modelBuilder.Entity<Project>()
            .HasOne(p => p.User)
            .WithMany(u => u.Projects)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // TaskItem
        modelBuilder.Entity<TaskItem>()
            .Property(t => t.Title)
            .HasMaxLength(160)
            .IsRequired();

        modelBuilder.Entity<TaskItem>()
            .Property(t => t.Description)
            .HasMaxLength(1000);

        modelBuilder.Entity<TaskItem>()
            .Property(t => t.Priority)
            .HasMaxLength(30)
            .IsRequired();

        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.Project)
            .WithMany(p => p.Tasks)
            .HasForeignKey(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.Category)
            .WithMany(c => c.Tasks)
            .HasForeignKey(t => t.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        // Category
        modelBuilder.Entity<Category>()
            .Property(c => c.Name)
            .HasMaxLength(80)
            .IsRequired();

        modelBuilder.Entity<Category>()
            .Property(c => c.Color)
            .HasMaxLength(30);

        modelBuilder.Entity<Category>()
            .HasOne(c => c.User)
            .WithMany(u => u.Categories)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Tag
        modelBuilder.Entity<Tag>()
            .Property(t => t.Name)
            .HasMaxLength(80)
            .IsRequired();

        modelBuilder.Entity<Tag>()
            .Property(t => t.Color)
            .HasMaxLength(30);

        modelBuilder.Entity<Tag>()
            .HasOne(t => t.User)
            .WithMany(u => u.Tags)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // TaskTag: relación N:M entre tareas y etiquetas
        modelBuilder.Entity<TaskTag>()
            .HasKey(tt => new { tt.TaskItemId, tt.TagId });

        modelBuilder.Entity<TaskTag>()
            .HasOne(tt => tt.TaskItem)
            .WithMany(t => t.TaskTags)
            .HasForeignKey(tt => tt.TaskItemId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TaskTag>()
            .HasOne(tt => tt.Tag)
            .WithMany(t => t.TaskTags)
            .HasForeignKey(tt => tt.TagId)
            .OnDelete(DeleteBehavior.Cascade);

        // Comment
        modelBuilder.Entity<Comment>()
            .Property(c => c.Content)
            .HasMaxLength(1000)
            .IsRequired();

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.TaskItem)
            .WithMany(t => t.Comments)
            .HasForeignKey(c => c.TaskItemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}