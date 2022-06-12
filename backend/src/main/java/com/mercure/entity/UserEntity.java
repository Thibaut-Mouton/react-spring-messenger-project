package com.mercure.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;

@Entity
@Table(name = "user")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity implements UserDetails, Serializable {

    public UserEntity(int id, String firstName, String password) {
        this.id = id;
        this.firstName = firstName;
        this.password = password;
    }

    @Id
    private int id;

    @Column(name = "firstname")
    private String firstName;

    @Column(name = "lastname")
    private String lastName;

    private String password;

    @Column(name = "wstoken")
    private String wsToken;

    private String jwt;

    @ManyToMany(fetch = FetchType.EAGER, mappedBy = "userEntities", cascade = CascadeType.ALL)
    private Set<GroupEntity> groupSet = new HashSet<>();

    @OneToMany(mappedBy = "groupMapping", fetch = FetchType.EAGER)
    private Set<GroupUser> groupUsers = new HashSet<>();

    @Column(name = "expiration_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date expiration_date;

    @Column(name = "short_url")
    private String shortUrl;

    @Column(name = "email")
    private String mail;

    @Column(name = "account_non_expired")
    private boolean accountNonExpired;

    @Column(name = "account_non_locked")
    private boolean accountNonLocked;

    @Column(name = "credentials_non_expired")
    private boolean credentialsNonExpired;

    @Column(name = "enabled")
    private boolean enabled;

    @Column(name = "role_id")
    private int role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return new ArrayList<>();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return firstName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}