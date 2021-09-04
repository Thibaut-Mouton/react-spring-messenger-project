package com.mercure.service;

import com.mercure.dto.MessageDTO;
import com.mercure.dto.NotificationDTO;
import com.mercure.entity.FileEntity;
import com.mercure.entity.GroupEntity;
import com.mercure.entity.MessageEntity;
import com.mercure.repository.MessageRepository;
import com.mercure.utils.MessageTypeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private FileService fileService;

    private static final String[] colorsArray =
            {
                    "#FFC194", "#9CE03F", "#62C555", "#3AD079",
                    "#44CEC3", "#F772EE", "#FFAFD2", "#FFB4AF",
                    "#FF9207", "#E3D530", "#D2FFAF", "FF5733"
            };

    private static final Map<Integer, String> colors = new HashMap<>();

    public String getRandomColor() {
        return colorsArray[new Random().nextInt(colorsArray.length)];
    }

    public MessageEntity createAndSaveMessage(int userId, int groupId, String type, String data) {
        MessageEntity msg = new MessageEntity(userId, groupId, type, data);
        return messageRepository.save(msg);
    }

    public void flush() {
        messageRepository.flush();
    }

    public MessageEntity save(MessageEntity messageEntity) {
        return messageRepository.save(messageEntity);
    }

    public List<MessageEntity> findByGroupId(int id, int offset) {
        List<MessageEntity> list = messageRepository.findByGroupIdAndOffset(id, offset);
        if (list.size() == 0) {
            return new ArrayList<>();
        }
        return list;
    }

    public MessageEntity findLastMessage(int groupId) {
        return messageRepository.findLastMessageByGroupId(groupId);
    }

    public int findLastMessageIdByGroupId(int groupId) {
        return messageRepository.findLastMessageIdByGroupId(groupId);
    }

    /**
     * Create a MessageDTO
     * Sent with user's initials
     *
     * @param id       of the message saved in DB
     * @param userId   int value for user ID
     * @param date     String of message sending date
     * @param group_id int value for group ID
     * @param message  string for the message content
     * @return a {@link MessageDTO}
     */
    public MessageDTO createMessageDTO(int id, String type, int userId, String date, int group_id, String message) {
        colors.putIfAbsent(userId, getRandomColor());
        String str = userService.findUsernameById(userId);
        String fileUrl = "";
        String[] arr = str.split(",");
        String initials = arr[0].substring(0, 1).toUpperCase() + arr[1].substring(0, 1).toUpperCase();
        String sender = StringUtils.capitalize(arr[0]) +
                " " +
                StringUtils.capitalize(arr[1]);
        if (type.equals(MessageTypeEnum.FILE.toString())) {
            FileEntity fileEntity = fileService.findByFkMessageId(id);
            fileUrl = fileEntity.getUrl();
        }
        return new MessageDTO(id, type, message, userId, group_id, null, sender, date, initials, colors.get(userId), fileUrl, userId == id);
    }

    public static String createUserInitials(String str) {
        String[] arr = str.split(",");
        return arr[0].substring(0, 1).toUpperCase() + arr[1].substring(0, 1).toUpperCase();
    }

    @Transactional
    public List<Integer> createNotificationList(int userId, String groupUrl) {
        int groupId = groupService.findGroupByUrl(groupUrl);
        List<Integer> toSend = new ArrayList<>();
        Optional<GroupEntity> optionalGroupEntity = groupService.findById(groupId);
        if (optionalGroupEntity.isPresent()) {
            GroupEntity groupEntity = optionalGroupEntity.get();
            groupEntity.getUserEntities().forEach(userEntity -> toSend.add(userEntity.getId()));
        }
        return toSend;
    }

    public NotificationDTO createNotificationDTO(MessageEntity msg) {
        String groupUrl = groupService.getGroupUrlById(msg.getGroup_id());
        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setGroupId(msg.getGroup_id());
        notificationDTO.setGroupUrl(groupUrl);
        if (msg.getType().equals(MessageTypeEnum.TEXT.toString())) {
            notificationDTO.setType(MessageTypeEnum.TEXT);
            notificationDTO.setMessage(msg.getMessage());
        }
        if (msg.getType().equals(MessageTypeEnum.FILE.toString())) {
            FileEntity fileEntity = fileService.findByFkMessageId(msg.getId());
            notificationDTO.setType(MessageTypeEnum.FILE);
            notificationDTO.setMessage(msg.getMessage());
            notificationDTO.setFileUrl(fileEntity.getUrl());
            notificationDTO.setFileName(fileEntity.getFilename());
        }
        notificationDTO.setFromUserId(msg.getUser_id());
        notificationDTO.setLastMessageDate(msg.getCreatedAt().toString());
        notificationDTO.setSenderName(userService.findFirstNameById(msg.getUser_id()));
        notificationDTO.setMessageSeen(false);
        return notificationDTO;
    }

    public MessageDTO createNotificationMessageDTO(MessageEntity msg, int userId) {
        String groupUrl = groupService.getGroupUrlById(msg.getGroup_id());
        String firstName = userService.findFirstNameById(msg.getUser_id());
        String initials = userService.findUsernameById(msg.getUser_id());
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setId(msg.getId());
        messageDTO.setType(MessageTypeEnum.TEXT.toString());
        messageDTO.setMessage(msg.getMessage());
        messageDTO.setUserId(msg.getUser_id());
        messageDTO.setGroupUrl(groupUrl);
        messageDTO.setGroupId(msg.getGroup_id());
        messageDTO.setSender(firstName);
        messageDTO.setTime(msg.getCreatedAt().toString());
        messageDTO.setInitials(createUserInitials(initials));
        messageDTO.setColor(colors.get(msg.getUser_id()));
        messageDTO.setMessageSeen(msg.getUser_id() == userId);
        return messageDTO;
    }
}
