package com.mercure.controller;

import com.mercure.dto.WrapperMessageDTO;
import com.mercure.service.GroupUserJoinService;
import com.mercure.service.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping(value = "/messages")
@CrossOrigin(allowCredentials = "true", origins = "http://localhost:3000")
public class MessageController {

    private final Logger log = LoggerFactory.getLogger(MessageController.class);

    @Autowired
    private MessageService messageService;

    @Autowired
    private GroupUserJoinService groupUserJoinService;

    @GetMapping(value = "{offset}/group/{groupUrl}")
    public WrapperMessageDTO fetchGroupMessages(@PathVariable String groupUrl, @PathVariable int offset) throws Exception {
        this.log.debug("Fetching messages from conversation");
        return this.messageService.getConversationMessage(groupUrl, offset);
    }

    @GetMapping(value = "seen/group/{groupUrl}/user/{userId}")
    public void markMessageAsSeen(@PathVariable String groupUrl, @PathVariable int userId) {
        this.log.debug("Mark message as seen");
        this.groupUserJoinService.saveLastMessageDate(userId, groupUrl);
    }
}
