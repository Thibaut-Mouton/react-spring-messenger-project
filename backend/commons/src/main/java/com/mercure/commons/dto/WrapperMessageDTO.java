package com.mercure.commons.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WrapperMessageDTO {

    private boolean isLastMessage;

    private String groupName;

    private boolean isActiveCall;

    private String callUrl;

    private List<MessageDTO> messages;
}
