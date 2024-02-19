package com.oddjobs.components;

import com.oddjobs.entities.users.User;
import com.oddjobs.repositories.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Component
@RequiredArgsConstructor
public class ContextProvider {

    private final UserRepository userRepository;
    public Collection<? extends GrantedAuthority> getAuthorities(){
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities();
    }

    public User getPrincipal(){
        Authentication context = SecurityContextHolder.getContext().getAuthentication();
        if(context != null){
            String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return userRepository.findByUsername(username);
        }
        return null;
    }
}
