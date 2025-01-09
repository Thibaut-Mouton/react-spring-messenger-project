package com.mercure.core.controller;

import com.mercure.commons.dto.WrapperMessageDTO;
import com.mercure.core.service.GroupUserJoinService;
import com.mercure.core.service.MessageService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/messages")
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
