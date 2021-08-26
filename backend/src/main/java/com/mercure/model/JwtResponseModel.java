package com.mercure.model;

import java.io.Serializable;

public class JwtResponseModel implements Serializable {

    private final String jwtToken;

    public JwtResponseModel(String jwtToken) {
        this.jwtToken = jwtToken;
    }

    public String getToken() {
        return this.jwtToken;
    }

}
