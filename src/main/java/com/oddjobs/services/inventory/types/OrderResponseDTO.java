package com.oddjobs.services.inventory.types;

import com.oddjobs.dtos.responses.SimplePosCenter;
import com.oddjobs.dtos.responses.WalletResponseDTO;
import com.oddjobs.entities.inventory.Order;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class OrderResponseDTO implements Serializable {
    private Long id;
    private Double amount;
    private WalletResponseDTO wallet;
    private Date date;
    private SimplePosCenter pos;
    private Order.STATUS status;
    private List<OrderItemResponseDTO> items = new ArrayList<>();

    public OrderResponseDTO(Order order){
        setId(order.getId());
        setAmount(order.getAmount().doubleValue());
        setWallet(new WalletResponseDTO(order.getWallet()));
        setDate(order.getCreatedAt());
        setPos(new SimplePosCenter(order.getPos()));
        setStatus(order.getStatus());
        setItems(order.getItems().stream().map(OrderItemResponseDTO::new).toList());
    }
}
