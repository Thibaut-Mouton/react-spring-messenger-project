package com.mercure.dto.user;

import com.mercure.dto.AuthUserDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InitUserDTO {

    private AuthUserDTO user;

    private List<GroupWrapperDTO> groupsWrapper;
}
