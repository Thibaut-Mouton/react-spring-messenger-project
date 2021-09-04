package com.mercure.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class MessageUserKey implements Serializable {

    public MessageUserKey() {
    }

    public MessageUserKey(int messageId, int userId) {
        this.messageId = messageId;
        this.userId = userId;
    }

    @Column(name = "message_id")
    private int messageId;

    @Column(name = "user_id")
    private int userId;

    public int getMessageId() {
        return messageId;
    }

    public void setMessageId(int messageId) {
        this.messageId = messageId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(messageId, userId);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        MessageUserKey groupRoleKey = (MessageUserKey) obj;
        return messageId == groupRoleKey.messageId &&
                userId == groupRoleKey.userId;
    }
}
