package com.mercure.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/")
public class PingController {

    private final Logger log = LoggerFactory.getLogger(PingController.class);

    @GetMapping("health-check")
    public String testRoute() {
        log.debug("Ping base route");
        return "Server status OK";
    }
}
