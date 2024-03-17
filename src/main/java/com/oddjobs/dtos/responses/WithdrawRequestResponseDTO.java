package com.oddjobs.dtos.responses;

import com.oddjobs.entities.Image;
import com.oddjobs.entities.WithdrawRequest;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class WithdrawRequestResponseDTO implements Serializable {
    private Long id;
    private String referenceNo;
    private String type;
    private WithdrawRequest.Status status;
    private SchoolResponseDTO school;
    private Double amount = 0.0;
    private Double amountReceived = 0.0;
    private String cancelReason;
    private Date createdAt;
    private List<ImageResponseDto> receipts =  new ArrayList<>();

    public WithdrawRequestResponseDTO(WithdrawRequest request) {
        setId(request.getId());
        setType(request.getType().toString());
        setReferenceNo(request.getReferenceNo());
        setStatus(request.getStatus());
        setAmount(request.getAmount().doubleValue());
        setCancelReason(request.getCancelReason());
        setCreatedAt(request.getCreatedAt());
        setAmountReceived(request.amountReceived().doubleValue());
        SchoolResponseDTO s = new SchoolResponseDTO(request.getSchool());
        setSchool(s);
        List<Image> images = request.getReceipts();
        if(images != null ){
            for(Image image: images ){
                receipts.add(new ImageResponseDto(image));
            }
            setReceipts(receipts);
        }
    }
}
