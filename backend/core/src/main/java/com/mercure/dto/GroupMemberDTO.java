package com.mercure.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GroupMemberDTO {

    private int userId;

    private String firstName;

    private String lastName;

    private boolean isAdmin;
}
