package com.oddjobs.dtos.requests;

import com.oddjobs.services.inventory.types.OrderItemRequestDTO;
import com.oddjobs.services.inventory.types.OrderItemResponseDTO;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
public class PaymentRequestDTO implements Serializable {
    @NotNull
    private Double amount;
    @NotNull
    private String cardNo;

    private List<OrderItemRequestDTO> items;

    private Long cashOutTransactionId;
}
