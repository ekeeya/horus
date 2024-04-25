package com.oddjobs.repositories.inventory;

import com.oddjobs.entities.inventory.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
}
