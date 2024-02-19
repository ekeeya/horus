package com.oddjobs.dtos.flutterwave.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class WebHookResponseData implements Serializable {
    private StatusData data;
    private String event;

}
