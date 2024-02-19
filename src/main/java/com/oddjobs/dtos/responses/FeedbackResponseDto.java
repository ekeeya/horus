package com.oddjobs.dtos.responses;

import com.oddjobs.entities.website.Feedbacks;

import lombok.Data;


@Data
public class FeedbackResponseDto {
    private Long id;
    private String name;
    private String comment;
    private Boolean status;

    public FeedbackResponseDto(Feedbacks feedbacks){
        if(feedbacks != null){
            setId(feedbacks.getId());
            setName(feedbacks.getName());
            setComment(feedbacks.getComment());
            setStatus(feedbacks.getStatus());
        }
    }
}
