package com.mercure.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "message_user")
@IdClass(MessageUserKey.class)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageUserEntity implements Serializable {

    @Id
    private int messageId;

    @Id
    private int userId;

    private boolean seen;

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
