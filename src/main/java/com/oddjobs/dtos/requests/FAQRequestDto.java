package com.oddjobs.dtos.requests;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class FAQRequestDto implements Serializable {
    private Long id;
    @NotNull
    private String question;
    @NotNull
    private String answer;
    @NotNull
    private Boolean status;


    public FAQRequestDto(){};

    public FAQRequestDto(Long id, @NotNull String question, @NotNull String answer, @NotNull Boolean status) {
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.status = status;
    }

}
