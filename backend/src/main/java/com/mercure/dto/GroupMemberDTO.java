package com.mercure.dto;

public class GroupMemberDTO {

    private int userId;

    private String firstName;

    private String lastName;

    private boolean isAdmin;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public GroupMemberDTO() {
    }

    public GroupMemberDTO(int userId, String firstName, String lastName, boolean isAdmin) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isAdmin = isAdmin;
    }
}
