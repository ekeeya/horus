package com.oddjobs.dtos.flutterwave.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class FlutterwaveStatusResponse implements Serializable {

        private String status;
        private String message;
        private StatusData data;

}
