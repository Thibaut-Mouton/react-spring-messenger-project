package com.mercure.dto;


public class GroupDTO {

    public GroupDTO() {
    }

    public GroupDTO(int id, String url, String name) {
        this.id = id;
        this.url = url;
        this.name = name;
    }

    public GroupDTO(int id, String url, String name, String lastMessage, String lastMessageDate) {
        this.id = id;
        this.url = url;
        this.name = name;
        this.lastMessage = lastMessage;
        this.lastMessageDate = lastMessageDate;
    }

    private int id;

    private String url;

    private String name;

    private String groupType;

    private String lastMessageSender;

    private String lastMessage;

    private String lastMessageDate;

    private boolean isLastMessageSeen;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGroupType() {
        return groupType;
    }

    public void setGroupType(String groupType) {
        this.groupType = groupType;
    }

    public String getLastMessageSender() {
        return lastMessageSender;
    }

    public void setLastMessageSender(String lastMessageSender) {
        this.lastMessageSender = lastMessageSender;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public String getLastMessageDate() {
        return lastMessageDate;
    }

    public void setLastMessageDate(String lastMessageDate) {
        this.lastMessageDate = lastMessageDate;
    }

    public boolean isLastMessageSeen() {
        return isLastMessageSeen;
    }

    public void setLastMessageSeen(boolean lastMessageSeen) {
        isLastMessageSeen = lastMessageSeen;
    }
}
