package com.mercure.controller;

import com.mercure.dto.AuthUserDTO;
import com.mercure.dto.JwtDTO;
import com.mercure.dto.LightUserDTO;
import com.mercure.dto.UserDTO;
import com.mercure.entity.GroupEntity;
import com.mercure.entity.GroupUser;
import com.mercure.entity.UserEntity;
import com.mercure.mapper.UserMapper;
import com.mercure.service.CustomUserDetailsService;
import com.mercure.service.GroupService;
import com.mercure.service.UserService;
import com.mercure.utils.JwtUtil;
import com.mercure.utils.StaticVariable;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(value = "/api")
@CrossOrigin(allowCredentials = "true")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtTokenUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserService userService;

    @Autowired
    private GroupService groupService;

    @PostMapping(value = "/auth")
    public AuthUserDTO createAuthenticationToken(@RequestBody JwtDTO authenticationRequest, HttpServletResponse response) throws Exception {
        authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
        UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        UserEntity user = userService.findByNameOrEmail(authenticationRequest.getUsername(), authenticationRequest.getUsername());
        String token = jwtTokenUtil.generateToken(userDetails);
        Cookie jwtAuthToken = new Cookie(StaticVariable.SECURE_COOKIE, token);
        jwtAuthToken.setHttpOnly(true);
        jwtAuthToken.setSecure(false);
        jwtAuthToken.setPath("/");
//        cookie.setDomain("http://localhost");
//         7 days
        jwtAuthToken.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(jwtAuthToken);
        return userMapper.toLightUserDTO(user);
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

    @GetMapping(value = "/fetch")
    public AuthUserDTO fetchInformation(HttpServletRequest request) {
        return userMapper.toLightUserDTO(getUserEntity(request));
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }

    @PostMapping(value = "/create")
    public String createGroupChat(HttpServletRequest request, @RequestBody String payload) throws ParseException {
        UserEntity user = getUserEntity(request);
        int userId;
        userId = user.getId();
        JSONParser parser = new JSONParser();
        JSONObject json = (JSONObject) parser.parse(payload);
        GroupUser groupUser = groupService.createGroup(userId, (String) json.get("name"));
        return groupUser.getGroupMapping().getUrl();
    }

    private UserEntity getUserEntity(HttpServletRequest request) {
        String username;
        String jwtToken;
        UserEntity user = new UserEntity();
        Cookie cookie = WebUtils.getCookie(request, StaticVariable.SECURE_COOKIE);
        if (cookie != null) {
            jwtToken = cookie.getValue();
            username = jwtTokenUtil.getUserNameFromJwtToken(jwtToken);
            user = userService.findByNameOrEmail(username, username);
        }
        return user;
    }
}