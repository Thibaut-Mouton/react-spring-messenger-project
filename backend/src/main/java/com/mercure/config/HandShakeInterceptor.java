package com.mercure.config;

import com.mercure.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.server.HandshakeInterceptor;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Configuration
public class HandShakeInterceptor implements HandshakeInterceptor, WebSocketHandler {

    @Autowired
    private UserService userService;

    private Logger log = LoggerFactory.getLogger(HandShakeInterceptor.class);

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        String jwtToken = request.getURI().getQuery().substring(6);
        if (StringUtils.isEmpty(jwtToken)) {
            return false;
        }
        String name = userService.findUsernameWithWsToken(jwtToken);
        int userId = userService.findUserIdWithToken(jwtToken);
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
            HttpSession session = servletRequest.getServletRequest().getSession();
            attributes.put("sessionId", session.getId());
            userService.getWsSessions().put(userId, session.getId());
        }
        return !StringUtils.isEmpty(name);
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
//        log.info("handshake finished");
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {

    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {

    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        log.info("connection closed : {}", session);
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
}
