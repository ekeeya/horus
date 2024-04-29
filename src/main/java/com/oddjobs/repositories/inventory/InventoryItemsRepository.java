package com.oddjobs.repositories.inventory;

import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.entities.inventory.InventoryItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryItemsRepository extends JpaRepository<InventoryItem, Long> {

    List<InventoryItem> findInventoryItemsByPosOrderByFrequencyDesc(PosCenterEntity pos);

    Page<InventoryItem> findInventoryItemsByPosAndNameLike(PosCenterEntity pos, String name, Pageable pageable);

    Page<InventoryItem> findInventoryItemsBy(Pageable pageable);
    Page<InventoryItem> findInventoryItemsByNameLike(String name, Pageable pageable);

    Page<InventoryItem> findInventoryItemsByPosOrderByFrequencyDesc(PosCenterEntity pos, Pageable pageable);

    InventoryItem findInventoryItemByNameAndPos(String name, PosCenterEntity posCenter);
}
