package com.mercure.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationUserDTO {

    private String firstName;

    private String lastName;

    private String password;

    private String email;
}
