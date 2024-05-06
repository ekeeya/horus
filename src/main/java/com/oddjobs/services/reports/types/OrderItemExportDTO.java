package com.oddjobs.services.reports.types;

import com.oddjobs.entities.inventory.OrderItem;
import lombok.Data;

import java.util.Date;

@Data
public class OrderItemExportDTO {
    private String transactionId;
    private String name;
    private String category;
    private Double unitPrice;
    private Integer quantity;
    private Double total;
    private String orderId;
    private Date date;
    private String pos;
    private String school;

    public  OrderItemExportDTO(OrderItem orderItem){
        transactionId =  orderItem.getOrder().getTransaction().getTransactionId();
        name = orderItem.getName();
        category = orderItem.getCategory().getName();
        unitPrice = orderItem.getPrice().doubleValue();
        quantity = orderItem.getQuantity();
        total =  (orderItem.getQuantity() * orderItem.getPrice().doubleValue());
        orderId =  String.format("Order-%s", orderItem.getOrder().getId());
        date = orderItem.getCreatedAt();
        pos = orderItem.getOrder().getPos().getName();
        school = orderItem.getOrder().getPos().getSchool().getName();
    }

}
