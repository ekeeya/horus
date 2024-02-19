package com.oddjobs.dtos.flutterwave.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class Meta implements Serializable {
   private Authorization authorization;
}
