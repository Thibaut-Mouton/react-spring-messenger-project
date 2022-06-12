package com.mercure.mapper;

import com.mercure.dto.AuthUserDTO;
import com.mercure.dto.GroupDTO;
import com.mercure.dto.UserDTO;
import com.mercure.entity.GroupEntity;
import com.mercure.entity.UserEntity;
import com.mercure.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserMapper {

    @Autowired
    private GroupMapper groupMapper;

    @Autowired
    private UserService userService;

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
        Set<GroupEntity> groups = userEntity.getGroupSet();
        List<GroupDTO> allUserGroups = userEntity.getGroupSet().stream()
                .map((groupEntity) -> groupMapper.toGroupDTO(groupEntity, userEntity.getId())).toList();
        Optional<GroupEntity> groupUrl = groups.stream().findFirst();
        String lastGroupUrl = groupUrl.isPresent() ? groupUrl.get().getUrl() : "";
        return new AuthUserDTO(userEntity.getId(), userEntity.getFirstName(), lastGroupUrl, userEntity.getWsToken(), allUserGroups);
    }
}
