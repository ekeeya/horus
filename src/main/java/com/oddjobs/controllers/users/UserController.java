/*
 * Online auctioning system
 *
 * Copyright (c) 2023.  Oddjobs an alias for the author of this software. - www.skycastleauctionhub.com
 *
 *
 * Created by Emmanuel Keeya Lubowa - ekeeya@oddjobs.tech <ekeeya@oddjobs.tech>.
 *
 * This program is not free software.
 *
 * NOTICE: All information contained herein is, and remains the property of Oddjobs. - www.oddjobs.tech
 */

package com.oddjobs.controllers.users;

import com.oddjobs.components.ContextProvider;
import com.oddjobs.components.Mapper;
import com.oddjobs.dtos.base.BaseResponse;
import com.oddjobs.dtos.base.ListResponseDTO;
import com.oddjobs.dtos.requests.ProspectRequestDto;
import com.oddjobs.dtos.requests.UserRequestDto;
import com.oddjobs.dtos.responses.ProspectResponseDto;
import com.oddjobs.exceptions.UserNameAlreadyExists;
import com.oddjobs.repositories.users.UserRepository;
import com.oddjobs.utils.Utils;
import com.oddjobs.services.jwt.RefreshTokenServiceImpl;
import com.oddjobs.services.jwt.TokenProviderService;
import com.oddjobs.dtos.responses.UserResponseDto;
import com.oddjobs.entities.tokens.RefreshToken;
import com.oddjobs.entities.users.Prospect;
import com.oddjobs.entities.users.SchoolUser;
import com.oddjobs.entities.users.User;
import com.oddjobs.services.users.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    private final Mapper mapper;
    private final TokenProviderService tokenProviderService;
    private final RefreshTokenServiceImpl refreshTokenService;
    private final ContextProvider contextProvider;

    protected ResponseEntity<?> generateTokens(User user) {
        Map<String,Object> accessToken = tokenProviderService.createToken(user, true, false);
        Map<String,Object>  refreshToken = tokenProviderService.createToken(user, true, true);
        Map<String, Object> tokens = new HashMap<>();
        tokens.put("access_token", accessToken);
        tokens.put("refresh_token", refreshToken);
        // save the refresh token
        RefreshToken rToken = new RefreshToken();
        String refresh_token = (String) refreshToken.get("token");
        rToken.setToken(refresh_token);
        refreshTokenService.save(rToken);
        return ResponseEntity.ok(tokens);
    }
    @GetMapping("")
    @Secured({"ROLE_ADMIN", "ROLE_SCHOOL"})
    public ResponseEntity<?> getUsers(
            @RequestParam(name = "accountType", required = false) Utils.ACCOUNT_TYPE accountType,
            @RequestParam(name = "name", required = false) String name, // make sure this is only allowed for parents
            @RequestParam(name = "pos", required = false) Long posId,
            @RequestParam(name = "parents", defaultValue = "false") boolean showParents,
            @RequestParam(name = "school", required = false) Long schoolId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {

        ListResponseDTO<UserResponseDto> response;
        User user =  contextProvider.getPrincipal();
        if(user instanceof SchoolUser){
            schoolId =  ((SchoolUser) user).getSchool().getId();
        }
        try {
            Page<? extends User> users;
            if (showParents){
                accountType = Utils.ACCOUNT_TYPE.PARENT;
            }
            if(name != null && accountType.equals(Utils.ACCOUNT_TYPE.PARENT)){
                users =  userService.searchParentsByName(name, page, size);
            } else if (schoolId != null && showParents) {
                users = userService.findParentsBySchool(schoolId, page, size);
            }
            else if (schoolId != null) {
                users = userService.findUsersBySchool(schoolId, page, size);
            }
            else if (accountType != null) {
                users = userService.findUsersByAccountType(accountType, page, size);
            }
            else if (posId != null) {
                users = userService.findUsersByPosCenter(posId, page, size);
            } else {
                users = userService.findAllUsers(page, size);
            }
            response = new ListResponseDTO<>(users.getContent().stream().map(mapper::toUserDTO).toList(), users.getTotalPages());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    @Secured({"ROLE_ADMIN", "ROLE_SCHOOL"})
    public ResponseEntity<?> getUser(
            @PathVariable(name = "userId") Long userId
    ){
        try{
            BaseResponse response =  new BaseResponse();
            User user =  userService.findById(userId);
            UserResponseDto userResponse =  mapper.toUserDTO(user);
            response.setData(userResponse);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e.getMessage(),e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(){
        try{
            User user =  contextProvider.getPrincipal();
            UserResponseDto userResponse =  mapper.toUserDTO(user);
            return ResponseEntity.ok(userResponse);
        }catch (Exception e){
            log.error(e.getMessage(),e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/tokens/refresh")
    public ResponseEntity<?> generateRefreshToken(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String headerValue) {
        try {
            String token = headerValue.substring("Bearer ".length());
            // generate new access and refresh token then retire the former refresh token
            // NOTE: We must only call this endpoint with a refresh token
            // otherwise if one calls it with an access token , we won't get a chance to expire the earlier refresh token
            // So let's check if it is a refresh token else we refuse the request
            if(!tokenProviderService.isRefreshToken(token)){
                throw  new InternalAuthenticationServiceException("Wrong refresh token");
            }
            SecurityContext securityContext = SecurityContextHolder.getContext();
            String username = securityContext.getAuthentication().getName();
            User user = userService.findByUsername(username);
            log.info(user+ " access tokens refreshed");
            return generateTokens(user);
        } catch (Exception e) {
            log.error(e.getMessage());
            return  ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("delete/{id}")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<?> deleteUser(
            @PathVariable(name = "id") Long id
    ) {
        try {
            User user = userRepository.findById(id).get();
            userRepository.delete(user);
            return ResponseEntity.ok().body("User deleted");
        } catch (NoSuchElementException e) {
            log.error(e.getMessage(), e);
            return ResponseEntity.badRequest().body(String.format("User with Id %s does not exist", id));
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("register")
    public ResponseEntity<?> registerUser(
            @Valid @RequestBody UserRequestDto request, BindingResult result
    ) {
        BaseResponse response;
        try {
            response = new BaseResponse(result);
            if (response.isSuccess()) {
                User user = userService.registerOrUpdateUser(request);
                UserResponseDto u = mapper.toUserDTO(user);
                response.setData(u);
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body(response);
        }
        catch (UserNameAlreadyExists e){
            log.warn(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        catch (Exception e) {
            log.error(e.getMessage(), e);
            response = new BaseResponse(e);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("prospect/register")
    public ResponseEntity<?> registerProspectUser(
            @Valid @RequestBody ProspectRequestDto request, BindingResult result
    ) {
        BaseResponse response;
        try {
            response = new BaseResponse(result);
            if (response.isSuccess()) {
                Prospect user = userService.register(request);
                ProspectResponseDto u = mapper.toProspectUserDTO(user);
                response.setData(u);
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body(response);
        }
        catch (Exception e) {
            log.error(e.getMessage(), e);
            response = new BaseResponse(e);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("account-management")
    public ResponseEntity<?> accountActions(
            @RequestParam(name = "action") Utils.ACCOUNT_ACTIONS action,
            @RequestParam(name = "account") Long accountId
    ) {
        try {
            User u = userService.accountManagement(action, accountId);
            log.info(String.format("User %s has been %s", u, action + "d"));
            UserResponseDto user =  mapper.toUserDTO(u);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
