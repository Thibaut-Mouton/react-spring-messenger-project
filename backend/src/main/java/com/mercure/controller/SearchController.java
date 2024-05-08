package com.mercure.controller;

import com.mercure.dto.search.FullTextSearchDTO;
import com.mercure.entity.GroupUser;
import com.mercure.entity.UserEntity;
import com.mercure.service.GroupUserJoinService;
import com.mercure.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/search")
@CrossOrigin(allowCredentials = "true", origins = "http://localhost:3000")
public class SearchController {

    @Autowired
    private UserService userService;

    @Autowired
    private GroupUserJoinService groupUserJoinService;

    @PostMapping()
    public void searchInDiscussions(FullTextSearchDTO search, Authentication authentication) {
        String name = authentication.getName();
        UserEntity user = this.userService.findByNameOrEmail(name, name);
        List<Integer> groupUser = groupUserJoinService.findAllGroupsByUserId(user.getId());
        groupUser.forEach(groupUserJoin -> {
        });
    }
}
