package com.mercure.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private int id;

    private String firstName;

    private String lastName;

    private String password;

    private String jwt;

    private String wsToken;

    private List<GroupDTO> groupList;

    private Date expiration_date;

    private String mail;

    private boolean accountNonExpired;

    private boolean accountNonLocked;

    private boolean credentialsNonExpired;

    private boolean enabled;

    private int role;

    private Collection<? extends GrantedAuthority> authorities;
}
