package com.mercure.mapper;

import com.mercure.dto.AuthUserDTO;
import com.mercure.dto.GroupDTO;
import com.mercure.dto.LightUserDTO;
import com.mercure.dto.UserDTO;
import com.mercure.entity.GroupEntity;
import com.mercure.entity.UserEntity;
import com.mercure.service.UserSeenMessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserMapper {

    private Logger log = LoggerFactory.getLogger(UserMapper.class);

    @Autowired
    private GroupMapper groupMapper;

    @Autowired
    private UserSeenMessageService seenMessageService;

    /**
     * Map a UserEntity to a UserDTO
     * The password is not sent
     *
     * @param userEntity the {@link UserEntity} to map
     * @return a {@link UserDTO}
     */
    public UserDTO toUserDTO(UserEntity userEntity) {
        // Init
        UserDTO userDTO = new UserDTO();
        List<GroupDTO> groupEntitySet = new ArrayList<>();

        // Main user infos
        userDTO.setId(userEntity.getId());
        userDTO.setFirstName(userEntity.getFirstName());
        userDTO.setLastName(userEntity.getLastName());
        userDTO.setMail(userEntity.getMail());
        userDTO.setWsToken(userEntity.getWsToken());
        // Global role
        userDTO.setRole(userEntity.getRole());
        // Spring security mapping
        userDTO.setAccountNonExpired(userEntity.isAccountNonExpired());
        userDTO.setAccountNonLocked(userEntity.isAccountNonLocked());
        userDTO.setCredentialsNonExpired(userEntity.isCredentialsNonExpired());
        userDTO.setEnabled(userEntity.isEnabled());
        userDTO.setExpiration_date(userEntity.getExpiration_date());
        userDTO.setJwt(userEntity.getJwt());
        userDTO.setAuthorities(userEntity.getAuthorities());
        userEntity.getGroupSet().forEach(groupEntity ->
                groupEntitySet.add(groupMapper.toGroupDTO(groupEntity, userEntity.getId())));
        userDTO.setGroupList(groupEntitySet);
        return userDTO;
    }


    public AuthUserDTO toLightUserDTO(UserEntity userEntity) {
        Optional<GroupEntity> groupUrl = userEntity.getGroupSet().stream().findFirst();
        String val = groupUrl.isPresent() ? groupUrl.get().getUrl() : "";
        return new AuthUserDTO(userEntity.getId(), userEntity.getFirstName(), val, userEntity.getWsToken());
    }
}
