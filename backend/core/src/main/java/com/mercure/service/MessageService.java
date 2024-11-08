package com.mercure.service;

import com.mercure.dto.MessageDTO;
import com.mercure.dto.WrapperMessageDTO;
import com.mercure.dto.search.FullTextSearchDatabaseResponse;
import com.mercure.dto.search.FullTextSearchDatabaseResponseDTO;
import com.mercure.dto.search.FullTextSearchResponseDTO;
import com.mercure.entity.*;
import com.mercure.repository.MessageRepository;
import com.mercure.utils.MessageTypeEnum;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class MessageService {

    private MessageRepository messageRepository;

    private FileService fileService;

    private GroupService groupService;

    private UserService userService;

    private GroupUserJoinService groupUserJoinService;

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

    public FullTextSearchResponseDTO searchMessages(int userId, String searchText) {
        List<Integer> groupIds = groupUserJoinService.findAllGroupsByUserId(userId);
        List<FullTextSearchDatabaseResponse> responseFromDB = messageRepository.findMessagesBySearchQuery(searchText, groupIds);
        FullTextSearchResponseDTO result = new FullTextSearchResponseDTO();
        Map<Integer, List<FullTextSearchDatabaseResponse>> studlistGrouped =
                responseFromDB.stream().collect(Collectors.groupingBy(FullTextSearchDatabaseResponse::getId));
        result.setMatchingText(searchText);
        List<FullTextSearchDatabaseResponseDTO> matchingMessages = new ArrayList<>();
        for (Map.Entry<Integer, List<FullTextSearchDatabaseResponse>> entry : studlistGrouped.entrySet()) {
            if (entry.getValue().get(0) != null) {
                FullTextSearchDatabaseResponseDTO fullTextSearchDTO = new FullTextSearchDatabaseResponseDTO();
                List<String> messages = entry.getValue().stream().map(FullTextSearchDatabaseResponse::getMessage).toList();
                fullTextSearchDTO.setMessages(messages);
                fullTextSearchDTO.setId(entry.getKey());
                fullTextSearchDTO.setGroupUrl(entry.getValue().get(0).getGroupUrl());
                fullTextSearchDTO.setGroupName(entry.getValue().get(0).getGroupName());
                matchingMessages.add(fullTextSearchDTO);
            }
        }
        result.setMatchingMessages(matchingMessages);
        return result;
    }

    public WrapperMessageDTO getConversationMessage(String url, int messageId) throws Exception {
        WrapperMessageDTO wrapper = new WrapperMessageDTO();
        if (url != null) {
            List<MessageDTO> messageDTOS = new ArrayList<>();
            GroupEntity group = groupService.getGroupByUrl(url);
            if (group == null) {
                log.error("Group not found with URL {}", url);
                throw new Exception("Group cannot be found by URL");
            }
            List<MessageEntity> newMessages = this.findByGroupId(group.getId(), messageId);
            int lastMessageId = newMessages != null && !newMessages.isEmpty() ? newMessages.get(0).getId() : 0;
            List<MessageEntity> afterMessages = this.findByGroupId(group.getId(), lastMessageId);
            if (newMessages != null) {
                newMessages.forEach(msg ->
                        messageDTOS.add(this
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
