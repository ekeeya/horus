package com.oddjobs.services.inventory;

import com.oddjobs.entities.inventory.Category;
import com.oddjobs.repositories.inventory.CategoryRepository;
import com.oddjobs.services.inventory.types.BulkCategoryRequestDTO;
import com.oddjobs.services.inventory.types.CategoryRequestDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public Category findById(Long id){
        Optional<Category> category =  categoryRepository.findById(id);
        return category.orElse(null);
    }

    public Category saveOrUpdate(CategoryRequestDTO request){
        Category category = new Category();
        if (request.getId() != null){
            category =  findById(request.getId());
        }
        category.setIcon(request.getIcon());
        category.setName(category.getName());
        category.setProvider(category.getProvider());
        category.setImage(category.getImage());
        return categoryRepository.save(category);
    }

    public void saveViaBulk(BulkCategoryRequestDTO request){
        Category category;
        category = categoryRepository.findCategoryByName(request.getName());
        if (category == null){
            category = new Category();
        }
        category.setIcon(request.getIcon());
        category.setName(request.getName());
        category.setProvider(request.getProvider());
        category.setImage(request.getImage());
        categoryRepository.save(category);
        log.info("Category: {} added", category);
    }

    public void delete(Long id) throws Exception {
        Category category = findById(id);
        if (category ==  null){
            throw new Exception("No category with id: "+id +" found");
        }
        categoryRepository.delete(category);
    }


    public List<Category> bulkCreate(List<Category> categories){
        List<Category> savedCategories = new ArrayList<>();
        for (Category category:categories ) {
            try{
                savedCategories.add(categoryRepository.save(category));
            }catch (Exception e){
                log.error(e.getMessage(), e);
            }
        }
        return savedCategories;
    }


    public Page<Category> fetchCategories(int size, int page, String name){
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        if (name == null){
            return categoryRepository.findAllBy(pageable);
        }else{
            return  categoryRepository.findCategoriesByNameLike(pageable, name);
        }


    }

}
