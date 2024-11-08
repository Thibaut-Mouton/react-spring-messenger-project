package com.mercure.controller;

import com.mercure.dto.WrapperMessageDTO;
import com.mercure.service.GroupUserJoinService;
import com.mercure.service.MessageService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping(value = "/messages")
@CrossOrigin(allowCredentials = "true", origins = "http://localhost:3000")
@AllArgsConstructor
@Slf4j
public class MessageController {

    private MessageService messageService;

    private GroupUserJoinService groupUserJoinService;

    @GetMapping(value = "{offset}/group/{groupUrl}")
    public WrapperMessageDTO fetchGroupMessages(@PathVariable String groupUrl, @PathVariable int offset) throws Exception {
        log.debug("Fetching messages from conversation");
        return this.messageService.getConversationMessage(groupUrl, offset);
    }

    @GetMapping(value = "seen/group/{groupUrl}/user/{userId}")
    public void markMessageAsSeen(@PathVariable String groupUrl, @PathVariable int userId) {
        log.debug("Mark message as seen");
        this.groupUserJoinService.saveLastMessageDate(userId, groupUrl);
    }
}
