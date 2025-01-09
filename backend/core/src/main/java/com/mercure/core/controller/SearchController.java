package com.mercure.core.controller;

import com.mercure.commons.dto.search.FullTextSearchDTO;
import com.mercure.commons.dto.search.FullTextSearchResponseDTO;
import com.mercure.commons.entity.UserEntity;
import com.mercure.core.service.MessageService;
import com.mercure.core.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/search")
@AllArgsConstructor
public class SearchController {

    private UserService userService;

    private MessageService messageService;

    @PostMapping()
    public FullTextSearchResponseDTO searchInDiscussions(@RequestBody FullTextSearchDTO search, Authentication authentication) {
        String name = authentication.getName();
        UserEntity user = this.userService.findByNameOrEmail(name, name);
        return this.messageService.searchMessages(user.getId(), search.getText());
    }
}
