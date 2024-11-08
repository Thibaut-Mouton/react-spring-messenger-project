package com.mercure.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {

    private int id;

    private String type;

    private String message;

    private int userId;

    private int groupId;

    private String groupUrl;

    private String sender;

    private String time;

    private String initials;

    private String color;

    private String fileUrl;

    private boolean isMessageSeen;
}
