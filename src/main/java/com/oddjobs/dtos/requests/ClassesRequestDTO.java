package com.oddjobs.dtos.requests;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ClassesRequestDTO {
    List<String> classes =  new ArrayList<>();
}
