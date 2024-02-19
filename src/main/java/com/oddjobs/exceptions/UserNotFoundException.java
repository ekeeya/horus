package com.oddjobs.exceptions;

public class UserNotFoundException  extends  Exception{
    public UserNotFoundException(Object  object) {
        super(String.format("User does not exist identified by %s", object));
    }
}
