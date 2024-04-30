package com.oddjobs.repositories.inventory;

import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.entities.inventory.Category;
import com.oddjobs.entities.inventory.InventoryItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryItemsRepository extends JpaRepository<InventoryItem, Long> {

    List<InventoryItem> findInventoryItemsByPosOrderByFrequencyDesc(PosCenterEntity pos);

    @Query("SELECT i FROM InventoryItem i WHERE i.pos = :pos AND LOWER(i.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<InventoryItem> findInventoryItemsByPosAndNameLike(PosCenterEntity pos, String name, Pageable pageable);

    Page<InventoryItem> findInventoryItemsBy(Pageable pageable);

    Page<InventoryItem> findInventoryItemsByCategory(Category category, Pageable pageable);

    Page<InventoryItem> findInventoryItemsByPosAndCategory(PosCenterEntity pos, Category category, Pageable pageable);
    Page<InventoryItem> findInventoryItemsByCategoryAndNameLikeIgnoreCase(Category category,String name, Pageable pageable);

    Page<InventoryItem> findInventoryItemsByPosAndCategoryAndNameLikeIgnoreCase(PosCenterEntity pos, Category category, String name, Pageable pageable);

    @Query("SELECT i FROM InventoryItem i WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<InventoryItem> findInventoryItemsByNameLikeIgnoreCase(String name, Pageable pageable);

    Page<InventoryItem> findInventoryItemsByPosOrderByFrequencyDesc(PosCenterEntity pos, Pageable pageable);

    InventoryItem findInventoryItemByNameAndPos(String name, PosCenterEntity posCenter);
}
