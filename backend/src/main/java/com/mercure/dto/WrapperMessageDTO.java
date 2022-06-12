package com.mercure.dto;

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

    private List<MessageDTO> messages;
}
