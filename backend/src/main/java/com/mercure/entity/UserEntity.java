package com.mercure.entity;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;

@Entity
@Table(name = "user")
public class UserEntity implements UserDetails, Serializable {

    public UserEntity() {
    }

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

    @OneToMany(mappedBy = "groupMapping",fetch = FetchType.EAGER)
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

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getWsToken() {
        return wsToken;
    }

    public void setWsToken(String wsToken) {
        this.wsToken = wsToken;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public Set<GroupEntity> getGroupSet() {
        return groupSet;
    }

    public void setGroupSet(Set<GroupEntity> groupSet) {
        this.groupSet = groupSet;
    }

    public Set<GroupUser> getGroupUsers() {
        return groupUsers;
    }

    public void setGroupUsers(Set<GroupUser> groupUsers) {
        this.groupUsers = groupUsers;
    }

    public Date getExpiration_date() {
        return expiration_date;
    }

    public void setExpiration_date(Date expiration_date) {
        this.expiration_date = expiration_date;
    }

    public String getShortUrl() {
        return shortUrl;
    }

    public void setShortUrl(String shortUrl) {
        this.shortUrl = shortUrl;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public void setAccountNonExpired(boolean accountNonExpired) {
        this.accountNonExpired = accountNonExpired;
    }

    public void setAccountNonLocked(boolean accountNonLocked) {
        this.accountNonLocked = accountNonLocked;
    }

    public void setCredentialsNonExpired(boolean credentialsNonExpired) {
        this.credentialsNonExpired = credentialsNonExpired;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public int getRole() {
        return role;
    }

    public void setRole(int role) {
        this.role = role;
    }
}