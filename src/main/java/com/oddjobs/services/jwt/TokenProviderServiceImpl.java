package com.oddjobs.services.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.oddjobs.entities.users.User;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;


@Service
@RequiredArgsConstructor
@Slf4j
public class TokenProviderServiceImpl implements TokenProviderService{

    @Value("${jwt.issuer}")
    private String issuer;
    @Value("${jwt.expires}")
    private int expires_in; // milliseconds

    private final Algorithm algorithm;

    @Override
    public Map<String, Object> createToken(Object principal, boolean authenticated, boolean isRefresh) {
        User user = (User) principal;
        // Refresh token takes twice longer to expire
        Map<String, Object> tokenData = new HashMap<>();
        int expiresIn = isRefresh ? expires_in*2 : expires_in;
        Date createdAt = Calendar.getInstance().getTime();
        String token = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis()+ expiresIn))
                .withIssuer(issuer)
                .withClaim("AUTHENTICATED", authenticated)
                .withClaim("REFRESH", isRefresh)
                .sign(algorithm);

        tokenData.put("token", token);
        tokenData.put("expiresIn", expiresIn);
        tokenData.put("createdAt", createdAt);
        return tokenData;
    }

    @Override
    public String extractJwtFromRequest(HttpServletRequest request) throws Exception {
        String authorizationHeader = request.getHeader(AUTHORIZATION);
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")){
            return  authorizationHeader.substring("Bearer ".length());
        }
        throw new Exception("Wrong authorization header value");
    }

    @Override
    public boolean isAuthenticated(DecodedJWT jwtToken) {
        return jwtToken.getClaim("AUTHENTICATED").asBoolean();
    }

    @Override
    public boolean isRefreshToken(String jwtToken){
        DecodedJWT token = validateToken(jwtToken);
        return token.getClaim("REFRESH").asBoolean();
    }

    @Override
    public DecodedJWT validateToken(String token) {
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token);
    }
}
