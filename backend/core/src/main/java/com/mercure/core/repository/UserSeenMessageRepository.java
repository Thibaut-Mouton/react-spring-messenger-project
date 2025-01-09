package com.mercure.core.repository;

import com.mercure.commons.entity.MessageUserEntity;
import com.mercure.commons.entity.MessageUserKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSeenMessageRepository extends JpaRepository<MessageUserEntity, MessageUserKey> {

    MessageUserEntity findAllByMessageIdAndUserId(int messageId, int userId);

}
