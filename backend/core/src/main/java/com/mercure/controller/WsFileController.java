package com.mercure.controller;

import com.mercure.dto.MessageDTO;
import com.mercure.dto.OutputTransportDTO;
import com.mercure.entity.MessageEntity;
import com.mercure.service.GroupService;
import com.mercure.service.MessageService;
import com.mercure.service.StorageService;
import com.mercure.service.UserSeenMessageService;
import com.mercure.utils.MessageTypeEnum;
import com.mercure.utils.TransportActionEnum;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(allowCredentials = "true", origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST})
@AllArgsConstructor
public class WsFileController {

    private static final Logger log = LoggerFactory.getLogger(WsFileController.class);

    private MessageService messageService;

    private GroupService groupService;

    private SimpMessagingTemplate messagingTemplate;

    private StorageService storageService;

    private UserSeenMessageService seenMessageService;

    /**
     * Receive file to put in DB and send it back to the group conversation
     *
     * @param file     The file to be uploaded
     * @param userId   int value for user ID sender of the message
     * @param groupUrl string value for the group URL
     * @return a {@link ResponseEntity} with HTTP code
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(@RequestParam(name = "file") MultipartFile file, @RequestParam(name = "userId") int userId, @RequestParam(name = "groupUrl") String groupUrl) {
        int groupId = groupService.findGroupByUrl(groupUrl);
        try {
            MessageEntity messageEntity = messageService.createAndSaveMessage(userId, groupId, MessageTypeEnum.FILE.toString(), "have send a file");
            storageService.store(file, messageEntity.getId());
            OutputTransportDTO res = new OutputTransportDTO();
            MessageDTO messageDTO = messageService.createNotificationMessageDTO(messageEntity, userId);
            res.setAction(TransportActionEnum.NOTIFICATION_MESSAGE);
            res.setObject(messageDTO);
            seenMessageService.saveMessageNotSeen(messageEntity, groupId);
            List<Integer> toSend = messageService.createNotificationList(userId, groupUrl);
            toSend.forEach(toUserId -> messagingTemplate.convertAndSend("/topic/user/" + toUserId, res));
        } catch (Exception e) {
            log.error("Cannot save file, caused by {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("files/groupUrl/{groupUrl}")
    public List<String> getMultimediaContent(@PathVariable String groupUrl) {
        return messageService.getMultimediaContentByGroup(groupUrl);
    }
}
