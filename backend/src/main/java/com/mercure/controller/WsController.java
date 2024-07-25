package com.mercure.controller;

import com.google.gson.Gson;
import com.mercure.dto.*;
import com.mercure.entity.GroupEntity;
import com.mercure.entity.MessageEntity;
import com.mercure.entity.MessageUserEntity;
import com.mercure.service.*;
import com.mercure.service.rtc.RtcService;
import com.mercure.utils.MessageTypeEnum;
import com.mercure.utils.RtcActionEnum;
import com.mercure.utils.TransportActionEnum;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class WsController {

    private final Logger log = LoggerFactory.getLogger(WsController.class);

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

    @Autowired
    private RtcService rtcService;

    @MessageMapping("/message")
    public void mainChannel(InputTransportDTO dto) {
        TransportActionEnum action = dto.getAction();
        switch (action) {
            case SEND_GROUP_MESSAGE:
                this.getAndSaveMessage(dto.getUserId(), dto.getGroupUrl(), dto.getMessage(), dto.getMessageType());
                break;
            case MARK_MESSAGE_AS_SEEN:
                if (!"".equals(dto.getGroupUrl())) {
                    int messageId = messageService.findLastMessageIdByGroupId(groupService.findGroupByUrl(dto.getGroupUrl()));
                    MessageUserEntity messageUserEntity = seenMessageService.findByMessageId(messageId, dto.getUserId());
                    if (messageUserEntity == null) {
                        break;
                    }
                    seenMessageService.saveMessageUserEntity(messageUserEntity);
                }
                break;
            case LEAVE_GROUP:
                if (!dto.getGroupUrl().isEmpty()) {
                    log.info("User id {} left group {}", dto.getUserId(), dto.getGroupUrl());
                    int groupId = groupService.findGroupByUrl(dto.getGroupUrl());
                    groupUserJoinService.removeUserFromConversation(dto.getUserId(), groupId);

                    String groupName = groupService.getGroupName(dto.getGroupUrl());
                    LeaveGroupDTO leaveGroupDTO = new LeaveGroupDTO();
                    leaveGroupDTO.setGroupUrl(dto.getGroupUrl());
                    leaveGroupDTO.setGroupName(groupName);
                    OutputTransportDTO leaveResponse = new OutputTransportDTO();
                    leaveResponse.setAction(TransportActionEnum.LEAVE_GROUP);
                    leaveResponse.setObject(leaveGroupDTO);
                    this.messagingTemplate.convertAndSend("/topic/user/" + dto.getUserId(), leaveResponse);
                } else {
                    log.warn("User cannot left group because groupUrl is empty");
                }
                break;
            default:
                break;
        }
    }

    @GetMapping("cache")
    public Object getAllCache() {
        return this.rtcService.showCache();
    }

    @MessageMapping("/rtc/{roomUrl}")
    public void webRtcChannel(@DestinationVariable String roomUrl, @Header("simpSessionId") String sessionId, RtcTransportDTO dto) {
        RtcActionEnum action = dto.getAction();
        this.rtcService.handleRtcAction(action, roomUrl, sessionId, dto);
    }

    /**
     * Receive message from user and dispatch to all users subscribed to conversation
     *
     * @param userId   the int userId for mapping message to a user
     * @param groupUrl the string groupUrl for mapping message to a group
     * @param message  the payload received
     */
    public void getAndSaveMessage(int userId, String groupUrl, String message, MessageTypeEnum messageType) {
        int groupId = groupService.findGroupByUrl(groupUrl);
        if (groupUserJoinService.checkIfUserIsAuthorizedInGroup(userId, groupId)) {
            return;
        }
        if (messageType.equals(MessageTypeEnum.CALL)) {
            GroupEntity group = groupService.getGroupByUrl(groupUrl);
            group.setCallUrl(message);
            group.setActiveCall(true);
            groupService.saveGroup(group);
        }
        MessageEntity messageEntity = new MessageEntity(userId, groupId, messageType.toString(), message);
        MessageEntity msg = messageService.save(messageEntity);
        List<Integer> toSend = messageService.createNotificationList(userId, groupUrl);

        // Save seen message
        seenMessageService.saveMessageNotSeen(msg, groupId);
        log.debug("Message saved");
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
    public String wsCallMessageMapping(@DestinationVariable int userId, String req) {
        log.info("Receiving RTC data, sending back to user ...");
        return req;
    }

    @MessageMapping("/groups/create/single")
    @SendToUser("/queue/reply")
    public void wsCreateConversation(String payload) {
        Gson gson = new Gson();
        CreateGroupDTO createGroup = gson.fromJson(payload, CreateGroupDTO.class);
        Long id1 = createGroup.getId1();
        Long id2 = createGroup.getId2();
        groupService.createConversation(id1.intValue(), id2.intValue());
    }
}
