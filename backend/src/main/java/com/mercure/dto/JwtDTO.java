package com.mercure.dto;

import java.io.Serializable;

public class JwtDTO implements Serializable {

    private String username;

    private String password;

    public JwtDTO() {
    }

    public JwtDTO(String username, String password) {
        this.setUsername(username);
        this.setPassword(password);
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
