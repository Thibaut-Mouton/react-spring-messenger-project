package com.mercure.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "group_user")
@IdClass(GroupRoleKey.class)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GroupUser implements Serializable {

    @Id
    private int groupId;

    @Id
    private int userId;

    @ManyToOne
    @MapsId("groupId")
    @JoinColumn(name = "group_id")
    GroupEntity groupUsers;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    UserEntity userEntities;

    private int role;

    @Override
    public int hashCode() {
        return Objects.hash(groupId, userId);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        GroupUser groupRoleKey = (GroupUser) obj;
        return groupId == groupRoleKey.groupId &&
                userId == groupRoleKey.userId;
    }
}
