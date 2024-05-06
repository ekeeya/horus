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
    private String studentName;
    private Long studentId;
    private Order.STATUS status;
    private String transactionId;
    private List<OrderItemResponseDTO> items = new ArrayList<>();

    public OrderResponseDTO(Order order){
        setId(order.getId());
        setAmount(order.getAmount().doubleValue());
        setWallet(new WalletResponseDTO(order.getWallet()));
        setDate(order.getCreatedAt());
        setPos(new SimplePosCenter(order.getPos()));
        setTransactionId(order.getTransaction() != null ? order.getTransaction().getTransactionId() : "-");
        setStatus(order.getStatus());
        setStudentId(order.getWallet().getStudent().getId());
        String student =  order.getWallet().getStudent().fullName() + " (" + order.getWallet().getStudent().getClassRoom().getName() +")";
        setStudentName(student);
        setItems(order.getItems().stream().map(OrderItemResponseDTO::new).toList());
    }
}
