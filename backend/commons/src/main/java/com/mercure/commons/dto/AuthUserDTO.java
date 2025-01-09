package com.mercure.commons.dto;

import com.mercure.commons.dto.user.GroupDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthUserDTO {

    private int id;

    private String firstName;

    private String lastName;

    private String firstGroupUrl;

    private String wsToken;

    private String color;

    private List<GroupDTO> groups;
}
