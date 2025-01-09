package com.mercure.core.controller;

import com.google.gson.Gson;
import com.mercure.commons.dto.AuthUserDTO;
import com.mercure.commons.dto.JwtDTO;
import com.mercure.commons.dto.user.GroupDTO;
import com.mercure.commons.dto.user.InitUserDTO;
import com.mercure.commons.entity.GroupEntity;
import com.mercure.commons.entity.UserEntity;
import com.mercure.core.mapper.UserMapper;
import com.mercure.core.service.CustomUserDetailsService;
import com.mercure.core.service.GroupService;
import com.mercure.core.service.UserService;
import com.mercure.core.service.JwtUtil;
import com.mercure.commons.utils.StaticVariable;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

@RestController
@AllArgsConstructor
@Slf4j
public class AuthenticationController {

    private JwtUtil jwtTokenUtil;

    private CustomUserDetailsService userDetailsService;

    private UserMapper userMapper;

    private UserService userService;

    private GroupService groupService;

    private AuthenticationProvider authenticationProvider;

    @PostMapping(value = "/auth")
    public AuthUserDTO createAuthenticationToken(@RequestBody JwtDTO authenticationRequest, HttpServletResponse response) {
        Authentication authentication = authenticationProvider.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword()));
        if (authentication.isAuthenticated()) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
            UserEntity user = userService.findByNameOrEmail(authenticationRequest.getUsername(), authenticationRequest.getUsername());
            String token = jwtTokenUtil.generateToken(userDetails);
            Cookie jwtAuthToken = new Cookie(StaticVariable.SECURE_COOKIE, token);
            jwtAuthToken.setHttpOnly(true);
            jwtAuthToken.setSecure(false);
            jwtAuthToken.setPath("/");
            // TODO add to env vars
            jwtAuthToken.setMaxAge(2 * 60 * 60); // 2 hours
            response.addCookie(jwtAuthToken);
            log.debug("User authenticated successfully");
            return userMapper.toLightUserDTO(user);
        } else {
            throw new UsernameNotFoundException("invalid user request");
        }
    }

    @GetMapping(value = "/logout")
    public ResponseEntity<?> fetchInformation(HttpServletResponse response) {
        Cookie cookie = new Cookie(StaticVariable.SECURE_COOKIE, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/csrf")
    public CsrfToken getCsrfToken(CsrfToken token) {
        return token;
    }

    @GetMapping(value = "/fetch")
    public InitUserDTO fetchInformation(HttpServletRequest request) {
        return userMapper.toUserDTO(getUserEntity(request));
    }

    @PostMapping(value = "/create")
    public GroupDTO createGroupChat(HttpServletRequest request, @RequestBody String payload) {
        UserEntity user = getUserEntity(request);
        Gson gson = new Gson();
        GroupDTO groupDTO = gson.fromJson(payload, GroupDTO.class);
        GroupEntity groupEntity = groupService.createGroup(user.getId(), groupDTO.getName());
        return userMapper.toGroupDTO(groupEntity, user.getId());
    }

    private UserEntity getUserEntity(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, StaticVariable.SECURE_COOKIE);
        String username = jwtTokenUtil.getUserNameFromJwtToken(cookie.getValue());
        return userService.findByNameOrEmail(username, username);
    }
}