package com.oddjobs.services.inventory;

import com.oddjobs.entities.inventory.InventoryItem;
import com.oddjobs.exceptions.PosCenterNotFoundException;
import com.oddjobs.repositories.inventory.InventoryItemsRepository;
import com.oddjobs.services.inventory.types.InventoryItemRequestDTO;
import com.oddjobs.services.pos.POSService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class InventoryItemService {

    private final InventoryItemsRepository inventoryItemsRepository;
    private final CategoryService categoryService;
    private final POSService posService;



    public InventoryItem findById(Long id){
        Optional<InventoryItem> item =  inventoryItemsRepository.findById(id);
        return item.orElse(null);
    }
    public InventoryItem saveOrUpdate(InventoryItemRequestDTO request) throws PosCenterNotFoundException {
        InventoryItem inventoryItem =  new InventoryItem();
        if (request.getId() != null){
            inventoryItem =  findById(request.getId());
        }
        inventoryItem.setName(request.getName());
        inventoryItem.setFrequency(request.getFrequency());
        inventoryItem.setPrice(BigDecimal.valueOf(request.getPrice()));
        inventoryItem.setCategory(categoryService.findById(request.getCategoryId()));
        inventoryItem.setPos(posService.findById(request.getPosId()));
        inventoryItem.setQuantity(request.getQuantity());
        return inventoryItemsRepository.save(inventoryItem);
    }

    public void delete(Long id){
        InventoryItem inventoryItem =  findById(id);
        inventoryItemsRepository.delete(inventoryItem);
    }

    public InventoryItem decreaseQuantity(InventoryItem item){
        int quantity = item.getQuantity();
        item.setQuantity(quantity-1);
        return inventoryItemsRepository.save(item);
    }


    public InventoryItem increaseFrequency (InventoryItem item){
        int frequency =  item.getFrequency();
        item.setFrequency(frequency+1);
        return inventoryItemsRepository.save(item);
    }

}
