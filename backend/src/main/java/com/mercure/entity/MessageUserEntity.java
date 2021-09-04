package com.mercure.entity;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "message_user")
@IdClass(MessageUserKey.class)
public class MessageUserEntity implements Serializable {

    @Id
    private int messageId;

    @Id
    private int userId;

    private boolean seen;

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

    public boolean getSeen() {
        return seen;
    }

    public void setSeen(boolean seen) {
        this.seen = seen;
    }

    @Override
    public int hashCode() {
        return Objects.hash(messageId, userId);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        MessageUserEntity groupRoleKey = (MessageUserEntity) obj;
        return messageId == groupRoleKey.messageId &&
                userId == groupRoleKey.userId;
    }
}
