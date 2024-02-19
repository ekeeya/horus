package com.oddjobs.services.jwt;


import com.oddjobs.entities.tokens.RefreshToken;

public interface RefreshTokenService {

    void revokeToken(String token);
    boolean isActiveToken(String token);
    void  save(RefreshToken token);
}
