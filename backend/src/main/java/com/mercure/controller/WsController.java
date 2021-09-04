package com.mercure.controller;

import com.mercure.dto.*;
import com.mercure.entity.MessageEntity;
import com.mercure.entity.MessageUserEntity;
import com.mercure.service.*;
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

    @Autowired
    private UserSeenMessageService seenMessageService;

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
        Map<Integer, String> sessions = userService.getWsSessions();
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
                    WrapperMessageDTO messages = this.getConversationMessage(dto.getGroupUrl(), dto.getMessageId());
                    OutputTransportDTO resMessages = new OutputTransportDTO();
                    if (dto.getMessageId() == -1) {
                        resMessages.setAction(TransportActionEnum.FETCH_GROUP_MESSAGES);
                    } else {
                        resMessages.setAction(TransportActionEnum.ADD_CHAT_HISTORY);
                    }
                    resMessages.setObject(messages);
                    this.messagingTemplate.convertAndSend("/topic/user/" + dto.getUserId(), resMessages);
                }
                break;
            case MARK_MESSAGE_AS_SEEN:
                if (!dto.getGroupUrl().equals("")) {
                    int messageId = messageService.findLastMessageIdByGroupId(groupService.findGroupByUrl(dto.getGroupUrl()));
                    MessageUserEntity messageUserEntity = seenMessageService.findByMessageId(messageId, dto.getUserId());
                    if (messageUserEntity == null) break;
                    messageUserEntity.setSeen(true);
                    seenMessageService.saveMessageUserEntity(messageUserEntity);
                }
                break;
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
        List<Integer> toSend = messageService.createNotificationList(userId, groupUrl);

        // Save seen message
        seenMessageService.saveMessageNotSeen(msg, groupId);

        OutputTransportDTO dto = new OutputTransportDTO();
        dto.setAction(TransportActionEnum.NOTIFICATION_MESSAGE);
        toSend.forEach(toUserId -> {
            MessageDTO messageDTO = messageService.createNotificationMessageDTO(msg, toUserId);
            dto.setObject(messageDTO);
            messagingTemplate.convertAndSend("/topic/user/" + toUserId, dto);
        });
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
    public WrapperMessageDTO getConversationMessage(String url, int messageId) {
        WrapperMessageDTO wrapper = new WrapperMessageDTO();
        if (url != null) {
            List<MessageDTO> messageDTOS = new ArrayList<>();
            int groupId = groupService.findGroupByUrl(url);
            List<MessageEntity> newMessages = messageService.findByGroupId(groupId, messageId);
            int lastMessageId = newMessages != null && newMessages.size() != 0 ? newMessages.get(0).getId() : 0;
            List<MessageEntity> afterMessages = messageService.findByGroupId(groupId, lastMessageId);
            if (newMessages != null) {
                wrapper.setLastMessage(afterMessages != null && afterMessages.size() == 0);
                newMessages.forEach(msg ->
                        messageDTOS.add(messageService
                                .createMessageDTO(msg.getId(), msg.getType(), msg.getUser_id(), msg.getCreatedAt().toString(), msg.getGroup_id(), msg.getMessage()))
                );
            }
            wrapper.setMessages(messageDTOS);
            return wrapper;
        }
        return null;
    }
}
