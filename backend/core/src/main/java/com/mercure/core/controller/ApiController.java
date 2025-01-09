package com.mercure.core.controller;

import com.google.gson.Gson;
import com.mercure.commons.dto.AuthenticationUserDTO;
import com.mercure.commons.dto.GroupMemberDTO;
import com.mercure.commons.entity.GroupEntity;
import com.mercure.commons.entity.GroupRoleKey;
import com.mercure.commons.entity.GroupUser;
import com.mercure.commons.entity.UserEntity;
import com.mercure.core.mapper.UserMapper;
import com.mercure.core.service.GroupService;
import com.mercure.core.service.GroupUserJoinService;
import com.mercure.core.service.UserService;
import com.mercure.commons.utils.ColorsUtils;
import com.mercure.core.service.JwtUtil;
import com.mercure.commons.utils.StaticVariable;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

import java.util.*;

@RestController
@AllArgsConstructor
@Slf4j
public class ApiController {

    private UserService userService;

    private GroupService groupService;

    private UserMapper userMapper;

    private GroupUserJoinService groupUserJoinService;

    private JwtUtil jwtUtil;

    @GetMapping(value = "/users/all/{groupUrl}")
    public List<GroupMemberDTO> fetchAllUsersNotInGroup(@PathVariable String groupUrl) {
        int groupId = groupService.findGroupByUrl(groupUrl);
        GroupRoleKey groupRoleKey = new GroupRoleKey();
        groupRoleKey.setGroupId(groupId);
        List<GroupUser> groupUsers = groupUserJoinService.findAllByGroupId(groupId);
        Object[] objects = groupUsers.stream().map(GroupUser::getUserId).toArray();
        int[] ids = new int[objects.length];
        for (int i = 0; i < objects.length; i++) {
            ids[i] = (int) objects[i];
        }
        return userService.fetchAllUsers(ids);
    }

    /**
     * Fetch all users in a conversation
     *
     * @param groupUrl string
     * @return List of {@link GroupMemberDTO}
     */
    @GetMapping(value = "/users/group/{groupUrl}")
    public List<GroupMemberDTO> fetchAllUsers(@PathVariable String groupUrl) {
        List<GroupMemberDTO> toSend = new ArrayList<>();
        int id = groupService.findGroupByUrl(groupUrl);
        Optional<GroupEntity> optionalGroupEntity = groupService.findById(id);
        if (optionalGroupEntity.isPresent()) {
            GroupEntity group = optionalGroupEntity.get();
            Set<GroupUser> groupUsers = group.getGroupUsers();
            groupUsers.forEach(groupUser -> toSend.add(userMapper.toGroupMemberDTO(groupUser)));
        }
        toSend.sort(Comparator.comparing(GroupMemberDTO::isAdmin).reversed());
        return toSend;
    }

    /**
     * Add user to a group conversation
     *
     * @param userId   int value for user ID
     * @param groupUrl String value for the group url
     * @return {@link ResponseEntity}, 200 if everything is ok or 500 if an error occurred
     */
    @GetMapping(value = "/user/add/{userId}/{groupUrl}")
    public ResponseEntity<GroupMemberDTO> addUserToConversation(@PathVariable int userId, @PathVariable String groupUrl) {
        int groupId = groupService.findGroupByUrl(groupUrl);
        try {
//            return ResponseEntity.ok().body(addedUsername + " has been added to " + groupService.getGroupName(groupUrl));
            return ResponseEntity.ok().body(groupService.addUserToConversation(userId, groupId));
        } catch (Exception e) {
            log.error("Error when trying to add user to conversation : {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }


    @GetMapping(value = "/user/remove/{userId}/group/{groupUrl}")
    public ResponseEntity<?> removeUserFromConversation(HttpServletRequest request, @PathVariable Integer userId, @PathVariable String groupUrl) {
        return doUserAction(request, userId, groupUrl, "delete");
    }

    @GetMapping(value = "/user/grant/{userId}/group/{groupUrl}")
    public ResponseEntity<?> grantUserAdminInConversation(HttpServletRequest request, @PathVariable Integer userId, @PathVariable String groupUrl) {
        return doUserAction(request, userId, groupUrl, "grant");
    }

    @GetMapping(value = "/user/remove/admin/{userId}/group/{groupUrl}")
    public ResponseEntity<?> removeAdminUserFromConversation(HttpServletRequest request, @PathVariable Integer userId, @PathVariable String groupUrl) {
        return doUserAction(request, userId, groupUrl, "removeAdmin");
    }

    @GetMapping(value = "/user/leave/{userId}/group/{groupUrl}")
    public ResponseEntity<?> leaveConversation(HttpServletRequest request, @PathVariable Integer userId, @PathVariable String groupUrl) {
        return doUserAction(request, userId, groupUrl, "removeUser");
    }

    private ResponseEntity<?> doUserAction(HttpServletRequest request, Integer userId, String groupUrl, String action) {
        Cookie cookie = WebUtils.getCookie(request, StaticVariable.SECURE_COOKIE);
        if (cookie == null) {
            return ResponseEntity.status(401).build();
        }
        String cookieToken = cookie.getValue();
        String username = jwtUtil.getUserNameFromJwtToken(cookieToken);
        int groupId = groupService.findGroupByUrl(groupUrl);
        String userToChange = userService.findUsernameById(userId);
        UserEntity userEntity = userService.findByNameOrEmail(username, username);
        if (userEntity != null) {
            int adminUserId = userEntity.getId();
            if (action.equals("removeUser")) {
                groupUserJoinService.removeUserFromConversation(userId, groupId);
            }
            if (userService.checkIfUserIsAdmin(adminUserId, groupId)) {
                try {
                    switch (action) {
                        case "grant" -> {
                            groupUserJoinService.grantUserAdminInConversation(userId, groupId);
                            return ResponseEntity.ok().body(userToChange + " has been granted administrator to " + groupService.getGroupName(groupUrl));
                        }
                        case "delete" -> {
                            groupUserJoinService.removeUserFromConversation(userId, groupId);
                            return ResponseEntity.ok().body(userToChange + " has been removed from " + groupService.getGroupName(groupUrl));
                        }
                        case "removeAdmin" -> {
                            groupUserJoinService.removeUserAdminFromConversation(userId, groupId);
                            return ResponseEntity.ok().body(userToChange + " has been removed from administrators of " + groupService.getGroupName(groupUrl));
                        }
                    }
                } catch (Exception e) {
                    log.warn("Error during performing {} : {}", action, e.getMessage());
                    return ResponseEntity.status(500).build();
                }
            }
        }
        return ResponseEntity.status(401).build();
    }


    /**
     * Register User
     *
     * @param data string req
     * @return a {@link ResponseEntity}
     */
    @PostMapping(value = "/user/register")
    public ResponseEntity<?> createUser(@RequestBody String data) {
        Gson gson = new Gson();
        AuthenticationUserDTO userDTO = gson.fromJson(data, AuthenticationUserDTO.class);

        if ((userService.checkIfUserNameOrMailAlreadyUsed(userDTO.getEmail()))) {
            return ResponseEntity.badRequest().body("mail already used, please choose another");
        }
        UserEntity user = new UserEntity();
        user.setFirstName(userDTO.getFirstname());
        user.setLastName(userDTO.getLastname());
        user.setMail(userDTO.getEmail());
        user.setPassword(userService.passwordEncoder(userDTO.getPassword()));
        user.setShortUrl(userService.createShortUrl(userDTO.getFirstname(), userDTO.getLastname()));
        user.setWsToken(UUID.randomUUID().toString());
        user.setColor(new ColorsUtils().getRandomColor());
        user.setRole(1);
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        user.setCredentialsNonExpired(true);
        user.setEnabled(true);
        try {
            userService.save(user);
            log.info("User saved successfully");
            return ResponseEntity.ok().body("User saved successfully");
        } catch (Exception e) {
            log.error("Error while registering user : {}", e.getMessage());
        }
        return ResponseEntity.status(500).build();
    }
}
