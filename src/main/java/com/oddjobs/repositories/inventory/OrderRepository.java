package com.oddjobs.repositories.inventory;

import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.entities.inventory.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findAllByOrderByIdDesc(Pageable pageable);

    Page<Order> findOrdersByPosOrderByIdDesc(PosCenterEntity pos, Pageable pageable);

    List<Order> findOrdersByPosAndCreatedAtBetween(PosCenterEntity pos, Date lower, Date upper);
    Page<Order> findOrdersByPosAndCreatedAtBetween(PosCenterEntity pos, Date lower, Date upper, Pageable pageable);

}
