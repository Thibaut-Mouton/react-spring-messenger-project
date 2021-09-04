package com.mercure.dto;

public class MessageDTO {

    public MessageDTO() {
    }

    public MessageDTO(int id, String type, String message, int userId, int groupId, String groupUrl, String sender, String time, String initials, String color, String fileUrl, boolean isMessageSeen) {
        this.id = id;
        this.type = type;
        this.message = message;
        this.userId = userId;
        this.groupId = groupId;
        this.groupUrl = groupUrl;
        this.sender = sender;
        this.time = time;
        this.initials = initials;
        this.color = color;
        this.fileUrl = fileUrl;
        this.isMessageSeen = isMessageSeen;
    }

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

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getGroupId() {
        return groupId;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }

    public String getGroupUrl() {
        return groupUrl;
    }

    public void setGroupUrl(String groupUrl) {
        this.groupUrl = groupUrl;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getInitials() {
        return initials;
    }

    public void setInitials(String initials) {
        this.initials = initials;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public boolean isMessageSeen() {
        return isMessageSeen;
    }

    public void setMessageSeen(boolean messageSeen) {
        isMessageSeen = messageSeen;
    }
}
