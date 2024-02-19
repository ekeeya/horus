package com.oddjobs.exceptions;

public class ParameterValidationException extends RuntimeException{

    public ParameterValidationException(String message) {
        super(message);
    }
}
