package com.mercure.commons.dto;

import com.mercure.commons.utils.MessageTypeEnum;
import com.mercure.commons.utils.TransportActionEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class InputTransportDTO {

    private int userId;

    private TransportActionEnum action;

    private String wsToken;

    private String groupUrl;

    private String message;

    private MessageTypeEnum messageType;

    private int messageId;
}
