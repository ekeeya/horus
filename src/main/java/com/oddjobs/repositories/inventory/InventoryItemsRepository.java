package com.oddjobs.repositories.inventory;

import com.oddjobs.entities.inventory.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryItemsRepository extends JpaRepository<InventoryItem, Long> {
}
