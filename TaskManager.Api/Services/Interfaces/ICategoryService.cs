using TaskManager.Api.DTOs.Categories;

namespace TaskManager.Api.Services.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllAsync(int userId);

    Task<CategoryDto> GetByIdAsync(int categoryId, int userId);

    Task<CategoryDto> CreateAsync(CreateCategoryDto request, int userId);

    Task<CategoryDto> UpdateAsync(int categoryId, UpdateCategoryDto request, int userId);

    Task DeleteAsync(int categoryId, int userId);
}