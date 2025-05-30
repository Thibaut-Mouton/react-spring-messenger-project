package com.mercure.core.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;

@Configuration
@EnableWebSocketSecurity
@ConditionalOnProperty(name = "websocket.csrf.enable", havingValue = "1")
public class WebSocketSecurityConfig {

    @Bean
    public AuthorizationManager<Message<?>> authorizationManager(MessageMatcherDelegatingAuthorizationManager.Builder messages) {
        messages.anyMessage().permitAll();
        return messages.build();
    }
}
