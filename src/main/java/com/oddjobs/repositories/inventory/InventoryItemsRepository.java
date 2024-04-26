package com.oddjobs.repositories.inventory;

import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.entities.inventory.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryItemsRepository extends JpaRepository<InventoryItem, Long> {

    List<InventoryItem> findInventoryItemsByPos(PosCenterEntity pos);
}
