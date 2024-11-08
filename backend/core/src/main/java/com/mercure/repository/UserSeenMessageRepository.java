package com.mercure.repository;

import com.mercure.entity.MessageUserEntity;
import com.mercure.entity.MessageUserKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSeenMessageRepository extends JpaRepository<MessageUserEntity, MessageUserKey> {

    MessageUserEntity findAllByMessageIdAndUserId(int messageId, int userId);

}
