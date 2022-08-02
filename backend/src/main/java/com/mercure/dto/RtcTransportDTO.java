package com.mercure.dto;

import com.mercure.utils.RtcActionEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class RtcTransportDTO {

    private int userId;

    private String groupUrl;

    private RtcActionEnum action;

    private Object offer;

    private Object answer;
}
