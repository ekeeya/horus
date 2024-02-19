package com.oddjobs.filters;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oddjobs.components.Mapper;
import com.oddjobs.entities.tokens.RefreshToken;
import com.oddjobs.entities.users.User;
import com.oddjobs.services.jwt.RefreshTokenService;
import com.oddjobs.services.jwt.TokenProviderService;
import com.oddjobs.dtos.responses.UserResponseDto;
import com.oddjobs.utils.SpringContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;


@Slf4j
public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private  final AuthenticationManager authenticationManager;

    public CustomAuthenticationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
        this.authenticationManager = authenticationManager;
    }

    private TokenProviderService tokenProviderService(){
       return  SpringContext.getBean(TokenProviderService.class);
    }
    private RefreshTokenService refreshTokenService(){
        return  SpringContext.getBean(RefreshTokenService.class);
    }

    private Mapper mapper(){return SpringContext.getBean(Mapper.class);}
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String username =  request.getParameter("username");
        String password =  request.getParameter("password");
        log.info("Attempted login by Username: {}", username);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
        return authenticationManager.authenticate(authenticationToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {
        Object principal=  authentication.getPrincipal();
        User u = (User) principal;
        Map<String,Object>  accessToken = tokenProviderService().createToken(principal,!u.isUsing2FA(), false);


        Map<String, Object> tokens=new HashMap<>();
        tokens.put("access_token", accessToken);
        if(!u.isUsing2FA()){
            Map<String,Object>  refreshToken = tokenProviderService().createToken(principal, true, true);
            tokens.put("refresh_token", refreshToken);
            UserResponseDto uDTO = mapper().toUserDTO(u);
            tokens.put("user", uDTO);
            // store in database
            RefreshToken rToken = new RefreshToken();
            String refresh_token = (String) refreshToken.get("token");
            rToken.setToken(refresh_token);
            refreshTokenService().save(rToken);
        }

        response.setContentType(APPLICATION_JSON_VALUE);
        new ObjectMapper().writeValue(response.getOutputStream(), tokens);

    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException, ServletException {
        super.unsuccessfulAuthentication(request, response, failed);
    }
}
