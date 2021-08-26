package com.mercure.dto;

import com.mercure.utils.MessageTypeEnum;

/**
 * POJO class used to send Notification to GroupSideBar
 */
public class NotificationDTO {

    private int fromUserId;

    private String senderName;

    private MessageTypeEnum type;

    private String message;

    private String lastMessageDate;

    private String groupUrl;

    private int groupId;

    public void setFromUserId(int fromUserId) {
        this.fromUserId = fromUserId;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setLastMessageDate(String lastMessageDate) {
        this.lastMessageDate = lastMessageDate;
    }

    public void setGroupUrl(String groupUrl) {
        this.groupUrl = groupUrl;
    }

    public void setMessageTypeEnum(MessageTypeEnum type) {
        this.type = type;
    }

    public int getGroupId() {
        return groupId;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }
}
