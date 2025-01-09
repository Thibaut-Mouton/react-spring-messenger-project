package com.mercure.core.config;

import com.mercure.core.service.CustomUserDetailsService;
import com.mercure.core.service.JwtUtil;
import com.mercure.commons.utils.StaticVariable;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import java.io.IOException;

@Configuration
@AllArgsConstructor
public class JwtWebConfig extends OncePerRequestFilter {

    private CustomUserDetailsService userDetailsService;

    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,@NonNull HttpServletResponse response,@NonNull FilterChain filterChain) throws IOException, ServletException {
        String jwtToken = null;
        String username;
        Cookie cookie = WebUtils.getCookie(request, StaticVariable.SECURE_COOKIE);

        if (cookie != null) {
            jwtToken = cookie.getValue();
        }
        if (jwtToken != null) {
            username = jwtUtil.getUserNameFromJwtToken(jwtToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtUtil.validateToken(jwtToken, userDetails)) {
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        filterChain.doFilter(request, response);
    }
}
