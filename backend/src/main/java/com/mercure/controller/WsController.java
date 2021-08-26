package com.mercure.controller;

import com.mercure.dto.*;
import com.mercure.entity.MessageEntity;
import com.mercure.entity.UserEntity;
import com.mercure.service.GroupService;
import com.mercure.service.GroupUserJoinService;
import com.mercure.service.MessageService;
import com.mercure.service.UserService;
import com.mercure.utils.*;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
public class WsController {

    private Logger log = LoggerFactory.getLogger(WsController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private GroupService groupService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private GroupUserJoinService groupUserJoinService;

    @GetMapping
    public String testRoute(HttpServletRequest request) {
        String requestTokenHeader = request.getHeader("authorization");
        if (StringUtils.isEmpty(requestTokenHeader)) {
            return null;
        }
        return jwtUtil.getUserNameFromJwtToken(requestTokenHeader.substring(7));
    }

    @MessageMapping("/message")
    public void mainChannel(InputTransportDTO dto, @Header("simpSessionId") String sessionId) {
        Map<Integer, String> sessions = userService.getMyMap();
        TransportActionEnum action = dto.getAction();
        switch (action) {
            case INIT_USER_DATA:
                List<GroupDTO> groups = this.initUserProfile(dto.getWsToken());
                OutputTransportDTO response = new OutputTransportDTO();
                response.setObject(groups);
                response.setAction(TransportActionEnum.INIT_USER_DATA);
                this.messagingTemplate.convertAndSend("/topic/user/" + dto.getUserId(), response);
                break;
            case SEND_GROUP_MESSAGE:
                this.getAndSaveMessage(dto.getUserId(), dto.getGroupUrl(), dto.getMessage());
                break;
            case FETCH_GROUP_MESSAGES:
                if (!dto.getGroupUrl().equals("")) {
                    int groupId = groupService.findGroupByUrl(dto.getGroupUrl());
                    if (dto.getGroupUrl().equals("") || groupUserJoinService.checkIfUserIsAuthorizedInGroup(dto.getUserId(), groupId)) {
                        break;
                    }
                    List<MessageDTO> messages = this.getConversationMessage(dto.getGroupUrl());
                    OutputTransportDTO resMessages = new OutputTransportDTO();
                    resMessages.setAction(TransportActionEnum.FETCH_GROUP_MESSAGES);
                    resMessages.setObject(messages);
                    this.messagingTemplate.convertAndSend("/topic/user/" + dto.getUserId(), resMessages);
                }
                break;
//            case GRANT_USER_ADMIN:
//                String grantResponse = doUserAction(dto.getWsToken(), dto.getUserId(), dto.getGroupUrl(), dto.getAction());
//                OutputTransportDTO res = new OutputTransportDTO();
//                res.setAction(TransportActionEnum.GRANT_USER_ADMIN);
//                MessageDTO m = new MessageDTO();
//                m.setSender();
//                m.setMessage(grantResponse);
//                res.setObject(grantResponse);
//                break;
            default:
                break;
        }
    }


    /**
     * Used this to retrieve user information (without password)
     * and all groups attached to the user
     *
     * @param token the String request from client
     * @return {@link UserDTO}
     */
    public List<GroupDTO> initUserProfile(String token) {
        String username = userService.findUsernameWithWsToken(token);
        if (StringUtils.isEmpty(username)) {
            log.warn("Username not found");
            return null;
        }
        UserDTO user = userService.getUserInformation(username);
        List<GroupDTO> toReturn = user.getGroupList();
        toReturn.sort(new ComparatorListGroupDTO());
        return toReturn;
    }


    /**
     * Receive message from user and dispatch to all users subscribed to conversation
     *
     * @param userId   the int userId for mapping message to a user
     * @param groupUrl the string groupUrl for mapping message to a group
     * @param message  the payload received
     */
    public void getAndSaveMessage(int userId, String groupUrl, String message) {
        int groupId = groupService.findGroupByUrl(groupUrl);
        if (groupUserJoinService.checkIfUserIsAuthorizedInGroup(userId, groupId)) {
            return;
        }
        MessageEntity messageEntity = new MessageEntity(userId, groupId, MessageTypeEnum.TEXT.toString(), message);
        MessageEntity msg = messageService.save(messageEntity);
        MessageDTO messageDTO = messageService.createNotificationMessageDTO(msg);
        List<Integer> toSend = messageService.createNotificationList(userId, groupUrl);
        OutputTransportDTO dto = new OutputTransportDTO();
        dto.setAction(TransportActionEnum.NOTIFICATION_MESSAGE);
        dto.setObject(messageDTO);
        toSend.forEach(toUserId -> messagingTemplate.convertAndSend("/topic/user/" + toUserId, dto));
        messageService.createMessageDTO(msg.getId(), msg.getType(), msg.getUser_id(), msg.getCreatedAt().toString(), msg.getGroup_id(), msg.getMessage());

    }

    @MessageMapping("/message/call/{userId}/group/{groupUrl}")
    @SendTo("/topic/call/reply/{groupUrl}")
    public String wsCallMessageMapping(@DestinationVariable int userId, String req) throws ParseException {
        JSONParser jsonParser = new JSONParser();
        JSONObject jsonObject = (JSONObject) jsonParser.parse(req);
        log.info("Receiving RTC data, sending back to user ...");
        JSONObject json = new JSONObject();
        try {
            json.put("userIn", userId);
            json.put("rtc", jsonObject);
        } catch (Exception e) {
            log.info(String.valueOf(json));
            log.info("Error during JSON creation : {}", e.getMessage());
        }
        return req;
    }

    @MessageMapping("/groups/create/single")
    @SendToUser("/queue/reply")
    public void wsCreateConversation(String req) throws ParseException {
        JSONParser jsonParser = new JSONParser();
        JSONObject jsonObject = (JSONObject) jsonParser.parse(req);
        Long id1 = (Long) jsonObject.get("id1");
        Long id2 = (Long) jsonObject.get("id2");
        groupService.createConversation(id1.intValue(), id2.intValue());
    }

    /**
     * Return history of group discussion
     *
     * @param url The group url to map
     * @return List of message
     */
    public List<MessageDTO> getConversationMessage(String url) {
        if (url != null) {
            List<MessageDTO> messageDTOS = new ArrayList<>();
            int groupId = groupService.findGroupByUrl(url);
            messageService.findByGroupId(groupId).forEach(msg -> {
                messageDTOS.add(messageService.createMessageDTO(msg.getId(), msg.getType(), msg.getUser_id(), msg.getCreatedAt().toString(), msg.getGroup_id(), msg.getMessage()));
            });
            return messageDTOS;
        }
        return null;
    }

//    private String doUserAction(String wsToken, Integer userIdToChange, String groupUrl, TransportActionEnum action) {
//        int groupId = groupService.findGroupByUrl(groupUrl);
//        int userAdminRequestId = userService.findUserIdWithToken(wsToken);
//        UserEntity userEntity = userService.findById(userIdToChange);
//        if (userEntity != null) {
//            int adminUserId = userEntity.getId();
//            if (action.equals("removeUser")) {
//                groupUserJoinService.removeUserFromConversation(userAdminRequestId, groupId);
//            }
//            if (userService.checkIfUserIsAdmin(adminUserId, groupId)) {
//                try {
//                    if (action.equals(TransportActionEnum.GRANT_USER_ADMIN)) {
//                        groupUserJoinService.grantUserAdminInConversation(userIdToChange, groupId);
//                        return userEntity.getFirstName() + " has been granted administrator to " + groupService.getGroupName(groupUrl);
//                    }
//                    if (action.equals("delete")) {
//                        groupUserJoinService.removeUserFromConversation(userIdToChange, groupId);
//                    }
//                    if (action.equals("removeAdmin")) {
//                        groupUserJoinService.removeUserAdminFromConversation(userIdToChange, groupId);
//                    }
//                } catch (Exception e) {
//                    log.warn("Error during performing {} : {}", action, e.getMessage());
//                }
//            }
//        }
//        return "";
//    }
}
