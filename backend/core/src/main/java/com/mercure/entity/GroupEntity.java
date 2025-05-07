package com.mercure.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mercure.utils.GroupTypeEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "chat_group")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GroupEntity {

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

    @Column(name = "active_call")
    private boolean activeCall;

    @Column(name = "call_url")
    private String callUrl;

    @Column(name = "type")
    @Enumerated(value = EnumType.STRING)
    private GroupTypeEnum groupTypeEnum;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "group_user",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    @JsonIgnore
    private Set<UserEntity> userEntities = new HashSet<>();

    @OneToMany(mappedBy = "groupUsers", fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<GroupUser> groupUsers = new HashSet<>();
}
