package com.mercure.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mercure.utils.GroupTypeEnum;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "chat_group")
public class GroupEntity implements Serializable {

    public GroupEntity() {
    }

    public GroupEntity(String name) {
        this.name = name;
    }

    public GroupEntity(int id, String name, String url) {
        this.id = id;
        this.name = name;
        this.url = url;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;

    private String url;

    @Column(name = "type")
    @Enumerated(value = EnumType.STRING)
    private GroupTypeEnum groupTypeEnum;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "group_user",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    @JsonIgnore
    private Set<UserEntity> userEntities = new HashSet<>();

    @OneToMany(mappedBy = "groupMapping", fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<GroupUser> groupUsers = new HashSet<>();

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public GroupTypeEnum getGroupTypeEnum() {
        return groupTypeEnum;
    }

    public void setGroupTypeEnum(GroupTypeEnum groupTypeEnum) {
        this.groupTypeEnum = groupTypeEnum;
    }

    public Set<UserEntity> getUserEntities() {
        return userEntities;
    }

    public void setUserEntities(Set<UserEntity> userEntities) {
        this.userEntities = userEntities;
    }

    public Set<GroupUser> getGroupUsers() {
        return groupUsers;
    }

    public void setGroupUsers(Set<GroupUser> groupUsers) {
        this.groupUsers = groupUsers;
    }
}
