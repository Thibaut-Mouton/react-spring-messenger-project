package com.mercure.controller;

import com.mercure.dto.search.FullTextSearchDTO;
import com.mercure.dto.search.FullTextSearchResponseDTO;
import com.mercure.entity.UserEntity;
import com.mercure.service.MessageService;
import com.mercure.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/search")
@CrossOrigin(allowCredentials = "true", origins = "http://localhost:3000")
public class SearchController {

    @Autowired
    private UserService userService;

    @Autowired
    private MessageService messageService;

    @PostMapping()
    public FullTextSearchResponseDTO searchInDiscussions(@RequestBody FullTextSearchDTO search, Authentication authentication) {
        String name = authentication.getName();
        UserEntity user = this.userService.findByNameOrEmail(name, name);
        return this.messageService.searchMessages(user.getId(), search.getText());
    }
}
