using TaskManager.Api.Models;

namespace TaskManager.Api.Repositories.Interfaces;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllByUserIdAsync(int userId);

    Task<Category?> GetByIdAndUserIdAsync(int categoryId, int userId);

    Task<Category> CreateAsync(Category category);

    Task UpdateAsync(Category category);

    Task DeleteAsync(Category category);
}