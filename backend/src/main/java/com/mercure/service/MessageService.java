package com.mercure.service;

import com.mercure.dto.MessageDTO;
import com.mercure.dto.NotificationDTO;
import com.mercure.dto.WrapperMessageDTO;
import com.mercure.entity.*;
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
    private FileService fileService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private UserService userService;

    public MessageEntity createAndSaveMessage(int userId, int groupId, String type, String data) {
        MessageEntity msg = new MessageEntity(userId, groupId, type, data);
        return messageRepository.save(msg);
    }

    public MessageEntity save(MessageEntity messageEntity) {
        return messageRepository.save(messageEntity);
    }

    public List<MessageEntity> findByGroupId(int id, int offset) {
        List<MessageEntity> list;
        if (offset == -1) {
            list = messageRepository.findLastMessagesByGroupId(id);
        } else {
            list = messageRepository.findByGroupIdAndOffset(id, offset);
        }
        return list;
    }

    public void deleteAllMessagesByGroupId(int groupId) {
        messageRepository.deleteMessagesDataByGroupId(groupId);
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
        UserEntity user = userService.findById(userId);
        String fileUrl = "";
        String initials = user.getFirstName().substring(0, 1).toUpperCase() + user.getLastName().substring(0, 1).toUpperCase();
        String sender = StringUtils.capitalize(user.getFirstName()) +
                " " +
                StringUtils.capitalize(user.getLastName());
        if (type.equals(MessageTypeEnum.FILE.toString())) {
            FileEntity fileEntity = fileService.findByFkMessageId(id);
            fileUrl = fileEntity.getUrl();
        }
        return new MessageDTO(id, type, message, userId, group_id, null, sender, date, initials, user.getColor(), fileUrl, userId == id);
    }

    public static String createUserInitials(String firstAndLastName) {
        String[] names = firstAndLastName.split(",");
        return names[0].substring(0, 1).toUpperCase() + names[1].substring(0, 1).toUpperCase();
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
        if (msg.getType().equals(MessageTypeEnum.CALL.toString())) {
            notificationDTO.setType(MessageTypeEnum.CALL);
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
        UserEntity user = userService.findById(userId);
        String firstName = userService.findFirstNameById(msg.getUser_id());
        String initials = userService.findUsernameById(msg.getUser_id());
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setId(msg.getId());
        if (msg.getType().equals(MessageTypeEnum.FILE.toString())) {
            String url = fileService.findFileUrlByMessageId(msg.getId());
            messageDTO.setFileUrl(url);
        }
        messageDTO.setType(msg.getType());
        messageDTO.setMessage(msg.getMessage());
        messageDTO.setUserId(msg.getUser_id());
        messageDTO.setGroupUrl(groupUrl);
        messageDTO.setGroupId(msg.getGroup_id());
        messageDTO.setSender(firstName);
        messageDTO.setTime(msg.getCreatedAt().toString());
        messageDTO.setInitials(createUserInitials(initials));
        messageDTO.setColor(user.getColor());
        messageDTO.setMessageSeen(msg.getUser_id() == userId);
        return messageDTO;
    }

    // TODO check that the request is authorized by user making the call
    public List<String> getMultimediaContentByGroup(String groupUrl) {
        int groupId = groupService.findGroupByUrl(groupUrl);
        return fileService.getFilesUrlByGroupId(groupId);
    }

    public WrapperMessageDTO getConversationMessage(String url, int messageId) {
        WrapperMessageDTO wrapper = new WrapperMessageDTO();
        if (url != null) {
            List<MessageDTO> messageDTOS = new ArrayList<>();
            GroupEntity group = groupService.getGroupByUrl(url);
            List<MessageEntity> newMessages = messageService.findByGroupId(group.getId(), messageId);
            int lastMessageId = newMessages != null && !newMessages.isEmpty() ? newMessages.get(0).getId() : 0;
            List<MessageEntity> afterMessages = messageService.findByGroupId(group.getId(), lastMessageId);
            if (newMessages != null) {
                newMessages.forEach(msg ->
                        messageDTOS.add(messageService
                                .createMessageDTO(msg.getId(), msg.getType(), msg.getUser_id(), msg.getCreatedAt().toString(), msg.getGroup_id(), msg.getMessage()))
                );
            }
            wrapper.setActiveCall(group.isActiveCall());
            wrapper.setCallUrl(group.getCallUrl());
            wrapper.setLastMessage(afterMessages != null && afterMessages.isEmpty());
            wrapper.setMessages(messageDTOS);
            wrapper.setGroupName(group.getName());
            return wrapper;
        }
        return null;
    }
}
