package com.mercure.core.service;

import com.mercure.commons.entity.GroupEntity;
import com.mercure.commons.entity.MessageEntity;
import com.mercure.commons.entity.MessageUserEntity;
import com.mercure.core.repository.UserSeenMessageRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserSeenMessageService {

    private UserSeenMessageRepository seenMessageRepository;

    private GroupService groupService;

    @Transactional
    public void saveMessageNotSeen(MessageEntity msg, int groupId) {
        Optional<GroupEntity> group = groupService.findById(groupId);

        group.ifPresent(groupEntity ->
                groupEntity.getUserEntities().forEach((user) -> {
                    MessageUserEntity message = new MessageUserEntity();
                    message.setMessageId(msg.getId());
                    message.setUserId(user.getId());
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
