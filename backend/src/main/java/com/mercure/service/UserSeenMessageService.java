package com.mercure.service;

import com.mercure.entity.*;
import com.mercure.repository.MessageRepository;
import com.mercure.repository.UserSeenMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserSeenMessageService {

    @Autowired
    private UserSeenMessageRepository seenMessageRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private GroupService groupService;

    @Transactional
    public void saveMessageNotSeen(MessageEntity msg, int groupId) {
        Optional<GroupEntity> group = groupService.findById(groupId);

        group.ifPresent(groupEntity ->
                groupEntity.getUserEntities().forEach((user) -> {
                    MessageUserEntity message = new MessageUserEntity();
                    message.setMessageId(msg.getId());
                    message.setUserId(user.getId());
                    message.setSeen(msg.getUser_id() == user.getId());
                    seenMessageRepository.save(message);
                }));
    }

    public MessageUserEntity findByMessageId(int messageId, int userId) {
        return seenMessageRepository.findAllByMessageIdAndUserId(messageId, userId);
    }

    public void saveMessageUserEntity(MessageUserEntity toSave) {
        seenMessageRepository.save(toSave);
    }
}
