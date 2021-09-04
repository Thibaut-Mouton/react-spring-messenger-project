package com.mercure.dto;

import java.util.List;

public class WrapperMessageDTO {

    private boolean isLastMessage;

    private List<MessageDTO> messages;

    public boolean isLastMessage() {
        return isLastMessage;
    }

    public void setLastMessage(boolean lastMessage) {
        isLastMessage = lastMessage;
    }

    public List<MessageDTO> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageDTO> messages) {
        this.messages = messages;
    }
}
