package com.oddjobs.services.jwt;

import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface TokenProviderService {

    public Map<String, Object> createToken(Object principal, boolean authenticated, boolean isRefresh);
    public String extractJwtFromRequest(HttpServletRequest request) throws Exception;

    public boolean isAuthenticated(DecodedJWT jwtToken);
    public boolean isRefreshToken(String jwtToken);
    public DecodedJWT validateToken(String token);
}
