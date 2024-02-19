package com.oddjobs.dtos.requests;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class FeedbackRequestDto implements Serializable {
    private Long id;
    @NotNull
    private String name;
    @NotNull
    private String comment;
    @NotNull
    private Boolean status;


    public FeedbackRequestDto(){};

    public FeedbackRequestDto(Long id, @NotNull String name, @NotNull String comment, @NotNull Boolean status) {
        this.id = id;
        this.name = name;
        this.comment = comment;
        this.status = status;
    }

}
