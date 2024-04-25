package com.oddjobs.repositories.inventory;

import com.oddjobs.entities.inventory.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository  extends JpaRepository<Category, Long> {

    Page<Category> findAllBy(Pageable pageable);

    Page<Category> findCategoriesByNameLike(Pageable pageable, String name);

    Category findCategoryByName(String name);
}
