package com.oddjobs.dtos.flutterwave.response;

import lombok.Data;
import java.io.Serializable;

@Data
public class Authorization implements Serializable {
    private String redirect;
    private String mode;
}
