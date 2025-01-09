package com.mercure.commons.dto;

import com.mercure.commons.utils.TransportActionEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OutputTransportDTO {

    private TransportActionEnum action;

    private Object object;
}