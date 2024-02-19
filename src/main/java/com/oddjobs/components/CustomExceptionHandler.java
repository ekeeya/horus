package com.oddjobs.components;

import com.oddjobs.exceptions.ParameterValidationException;
import com.oddjobs.dtos.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ParameterValidationException.class)
    protected ResponseEntity<Object> handleParameterValidationException(ParameterValidationException ex) {
        // Create a custom error response
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());

        // Return the response with a 400 Bad Request status
        return ResponseEntity.badRequest().body(errorResponse);
    }
}
