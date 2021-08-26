package com.mercure.dto;

import com.mercure.utils.TransportActionEnum;

public class OutputTransportDTO {

    private TransportActionEnum action;

    private Object object;

    public TransportActionEnum getAction() {
        return action;
    }

    public void setAction(TransportActionEnum action) {
        this.action = action;
    }

    public Object getObject() {
        return object;
    }

    public void setObject(Object object) {
        this.object = object;
    }
}