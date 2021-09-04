package com.mercure.controller;

import com.mercure.dto.MessageDTO;
import com.mercure.dto.NotificationDTO;
import com.mercure.dto.OutputTransportDTO;
import com.mercure.entity.FileEntity;
import com.mercure.entity.MessageEntity;
import com.mercure.service.GroupService;
import com.mercure.service.MessageService;
import com.mercure.service.StorageService;
import com.mercure.service.UserSeenMessageService;
import com.mercure.utils.MessageTypeEnum;
import com.mercure.utils.TransportActionEnum;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * API controller to handle file upload
 */
@RestController
@CrossOrigin
@RequestMapping("/api")
public class WsFileController {

    private static Logger log = LoggerFactory.getLogger(WsFileController.class);

    @Autowired
    private MessageService messageService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private StorageService storageService;

    @Autowired
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
            MessageEntity messageEntity = messageService.createAndSaveMessage(userId, groupId, MessageTypeEnum.FILE.toString(), "has send a file");
            storageService.store(file, messageEntity.getId());
            OutputTransportDTO res = new OutputTransportDTO();
            NotificationDTO notificationDTO = messageService.createNotificationDTO(messageEntity);
            res.setAction(TransportActionEnum.NOTIFICATION_MESSAGE);
            res.setObject(notificationDTO);
            seenMessageService.saveMessageNotSeen(messageEntity, groupId);
            List<Integer> toSend = messageService.createNotificationList(userId, groupUrl);
            toSend.forEach(toUserId -> messagingTemplate.convertAndSend("/topic/user/" + toUserId, res));
        } catch (Exception e) {
            log.error("Cannot save file, caused by {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }
        return ResponseEntity.ok().build();
    }
}
