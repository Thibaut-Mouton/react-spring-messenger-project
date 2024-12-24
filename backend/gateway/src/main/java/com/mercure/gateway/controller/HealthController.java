package com.mercure.gateway.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequestMapping()
@RestController
public class HealthController {

    @GetMapping
    public String healthCheck() {
        log.info("Health check Gateway OK");
        return "OK - gateway";
    }
}