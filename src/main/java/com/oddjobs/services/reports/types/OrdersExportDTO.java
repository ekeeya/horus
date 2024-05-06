package com.oddjobs.services.reports.types;

import com.oddjobs.entities.inventory.Order;
import lombok.Data;

import java.util.Date;
import java.util.stream.Collectors;

@Data
public class OrdersExportDTO {

    private String transactionId;
    private String studentName;
    private String cardNo;
    private Double amount;
    private Date date;
    private String items;
    private String status;
    private String school;
    private String pos;

    public OrdersExportDTO(Order order){
        transactionId = order.getTransaction().getTransactionId();
        studentName = order.getWallet().getStudent().fullName();
        cardNo =  order.getWallet().getCardNo();
        amount = order.getAmount().doubleValue();
        date = order.getCreatedAt();
        items =  order.getItems().stream()
                .map(item -> item.getName() + " -> x" + item.getQuantity())
                .collect(Collectors.joining(", "));
        school =  order.getPos().getSchool().getName();
        pos = order.getPos().getName();
        status=order.getStatus().toString();
    }
}
