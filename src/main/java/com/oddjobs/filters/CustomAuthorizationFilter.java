package com.oddjobs.filters;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oddjobs.services.jwt.RefreshTokenService;
import com.oddjobs.services.jwt.TokenProviderService;
import com.oddjobs.services.users.UserService;
import com.oddjobs.utils.SpringContext;
import com.oddjobs.utils.Utils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

@Slf4j
public class CustomAuthorizationFilter extends OncePerRequestFilter {

    private TokenProviderService tokenProviderService() {
        return SpringContext.getBean(TokenProviderService.class);
    }

    private RefreshTokenService refreshTokenService() {
        return SpringContext.getBean(RefreshTokenService.class);
    }



    private UserService userService() {
        return SpringContext.getBean(UserService.class);
    }


    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();
        if (path.equals("/login") || path.equals("/api/v1/register")) {
            filterChain.doFilter(request, response);
        } else {
            String authorizationHeader = request.getHeader(AUTHORIZATION);
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                try {
                    String token = tokenProviderService().extractJwtFromRequest(request);
                    DecodedJWT decodedJWT = tokenProviderService().validateToken(token);
                    String username = decodedJWT.getSubject();

                    UserDetails userDetails = userService().loadUserByUsername(username);

                    Collection<? extends GrantedAuthority> authorities = tokenProviderService().isAuthenticated(decodedJWT)?userDetails.getAuthorities():List.of(new SimpleGrantedAuthority(Utils.ROLES.ROLE_PRE_VERIFIED.toString()));
                    // if it is a refresh token but expired
                    boolean isRefreshToken = tokenProviderService().isRefreshToken(token);
                    boolean isActive = refreshTokenService().isActiveToken(token);
                    if (isRefreshToken && !isActive) {
                        throw new InternalAuthenticationServiceException("The refresh Token used is Expired or is wrong");
                    }
                    // if it is a refresh token and active
                    // Expire it since we only use it once, next time one uses it, it won't work.
                    // Force the client's hand to only use the refresh token to generate fresh access tokens
                    // The rest will be handled in the controllers
                    refreshTokenService().revokeToken(token); // proceed only for this request

                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, null, authorities);
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                    filterChain.doFilter(request, response);
                } catch (Exception exception) {
                    log.error("Error logging in: {}", exception.getMessage());
                    response.setHeader("error", exception.getMessage());
                    response.setStatus(FORBIDDEN.value());
                    Map<String, String> errors = new HashMap<>();
                    errors.put("error", exception.getMessage());
                    response.setContentType(APPLICATION_JSON_VALUE);
                    new ObjectMapper().writeValue(response.getOutputStream(), errors);
                }
            } else {
                filterChain.doFilter(request, response);
            }
        }
    }
}
