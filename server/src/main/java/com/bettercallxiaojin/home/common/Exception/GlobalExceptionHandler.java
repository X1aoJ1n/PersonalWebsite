package com.bettercallxiaojin.home.common.Exception;

import com.bettercallxiaojin.home.pojo.entity.Response;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Response<Object> handleValidationException(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult()
                .getFieldError()
                .getDefaultMessage();
        return Response.error(errorMessage);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public Response<Object> handleJsonParseException(HttpMessageNotReadableException ex) {
        return Response.error("Invalid request format: " + ex.getMostSpecificCause().getMessage(), 400);
    }
}