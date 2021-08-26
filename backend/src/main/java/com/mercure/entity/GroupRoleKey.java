package com.mercure.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class GroupRoleKey implements Serializable {

    public GroupRoleKey() {
    }

    public GroupRoleKey(int groupId, int userId) {
        this.groupId = groupId;
        this.userId = userId;
    }

    @Column(name = "group_id")
    private int groupId;

    @Column(name = "user_id")
    private int userId;


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

    @Override
    public int hashCode() {
        return Objects.hash(groupId, userId);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        GroupRoleKey groupRoleKey = (GroupRoleKey) obj;
        return groupId == groupRoleKey.groupId &&
                userId == groupRoleKey.userId;
    }
}
