package com.oddjobs.repositories.inventory;

import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.entities.inventory.Order;
import com.oddjobs.entities.inventory.OrderItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Date;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    Page<OrderItem> findOrderItemsByOrder_StatusAndOrder_PosAndCreatedAtBetween(
            Order.STATUS status,
            PosCenterEntity pos,
            Date lowerDate,
            Date upperDate,
            Pageable pageable);


    Page<OrderItem> findOrderItemsByOrder_StatusAndCreatedAtBetween(
            Order.STATUS status,
            Date lowerDate,
            Date upperDate,
            Pageable pageable
    );
}
