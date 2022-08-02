package com.mercure.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    private String firstGroupUrl;
}
