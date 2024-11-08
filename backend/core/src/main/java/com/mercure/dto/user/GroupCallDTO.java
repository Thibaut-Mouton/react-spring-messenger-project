package com.mercure.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class GroupCallDTO {

    private Boolean anyCallActive;

    private String activeCallUrl;
}
