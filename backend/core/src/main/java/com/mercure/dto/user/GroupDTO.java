package com.mercure.dto.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class GroupDTO {

    private int id;

    private String url;

    private String name;

    private String groupType;

    private String lastMessageSender;

    private String lastMessage;

    private String lastMessageDate;

    private boolean isLastMessageSeen;
}
