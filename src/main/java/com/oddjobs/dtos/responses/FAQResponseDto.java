package com.oddjobs.dtos.responses;

import com.oddjobs.entities.website.FAQs;
import lombok.Data;


@Data
public class FAQResponseDto {
    private Long id;
    private String question;
    private String answer;
    private Boolean status;

    public FAQResponseDto(FAQs faqs){
        if(faqs != null){
            setId(faqs.getId());
            setAnswer(faqs.getAnswer());
            setQuestion(faqs.getQuestion());
            setStatus(faqs.getStatus());
        }
    }
}
