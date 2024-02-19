package com.oddjobs.exceptions;

public class UserNameAlreadyExists extends  Exception{
    public UserNameAlreadyExists(String  username) {
        super(String.format("Username %s already taken", username));
    }
}
