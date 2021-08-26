package com.mercure.dto;

public class LightUserDTO {

    public LightUserDTO() {
    }

    public LightUserDTO(int id, String firstName, String wsToken) {
        this.id = id;
        this.firstName = firstName;
        this.wsToken = wsToken;
    }

    public int id;

    public String firstName;

    public String lastName;

    private int groupRole;

    private String wsToken;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public int getGroupRole() {
        return groupRole;
    }

    public void setGroupRole(int groupRole) {
        this.groupRole = groupRole;
    }

    public String getWsToken() {
        return wsToken;
    }

    public void setWsToken(String wsToken) {
        this.wsToken = wsToken;
    }
}
