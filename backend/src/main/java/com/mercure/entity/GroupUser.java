package com.mercure.entity;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "group_user")
@IdClass(GroupRoleKey.class)
public class GroupUser implements Serializable {

    @Id
    private int groupId;

    @Id
    private int userId;

    @ManyToOne
    @MapsId("groupId")
    @JoinColumn(name = "group_id")
    GroupEntity groupMapping;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    UserEntity userMapping;

    private int role;

    public int getGroupId() {
        return groupId;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public GroupEntity getGroupMapping() {
        return groupMapping;
    }

    public void setGroupMapping(GroupEntity groupMapping) {
        this.groupMapping = groupMapping;
    }

    public UserEntity getUserMapping() {
        return userMapping;
    }

    public void setUserMapping(UserEntity userMapping) {
        this.userMapping = userMapping;
    }

    public int getRole() {
        return role;
    }

    public void setRole(int role) {
        this.role = role;
    }

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
