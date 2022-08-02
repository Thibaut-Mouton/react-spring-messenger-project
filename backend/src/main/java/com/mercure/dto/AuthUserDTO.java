package com.mercure.dto;

import com.mercure.dto.user.GroupDTO;
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

    private String username;

    private String firstGroupUrl;

    private String wsToken;

    private List<GroupDTO> groups;
}
