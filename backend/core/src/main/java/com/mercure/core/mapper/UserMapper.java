package com.mercure.core.mapper;

import com.mercure.commons.dto.AuthUserDTO;
import com.mercure.commons.dto.GroupMemberDTO;
import com.mercure.commons.dto.user.GroupDTO;
import com.mercure.commons.dto.user.GroupWrapperDTO;
import com.mercure.commons.dto.user.InitUserDTO;
import com.mercure.commons.entity.*;
import com.mercure.core.service.GroupUserJoinService;
import com.mercure.core.service.MessageService;
import com.mercure.core.service.UserSeenMessageService;
import com.mercure.core.service.UserService;
import com.mercure.commons.utils.ComparatorListGroupDTO;
import com.mercure.commons.utils.ComparatorListWrapperGroupDTO;
import com.mercure.commons.utils.MessageTypeEnum;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class UserMapper {

    private GroupCallMapper groupCallMapper;

    private MessageService messageService;

    private UserSeenMessageService seenMessageService;

    private GroupUserJoinService groupUserJoinService;

    private UserService userService;

    /**
     * Map a UserEntity to a UserDTO
     * The password is not sent
     *
     * @param userEntity the {@link UserEntity} to map
     * @return a {@link AuthUserDTO}
     */
    public InitUserDTO toUserDTO(UserEntity userEntity) {
        AuthUserDTO userDTO = new AuthUserDTO();
        InitUserDTO initUserDTO = new InitUserDTO();
        List<GroupWrapperDTO> groupWrapperDTOS = new ArrayList<>();

        userDTO.setId(userEntity.getId());
        userDTO.setFirstName(userEntity.getFirstName());
        userDTO.setLastName(userEntity.getLastName());
        userDTO.setWsToken(userEntity.getWsToken());
        userDTO.setColor(userEntity.getColor());

        userEntity.getGroupSet().forEach(groupEntity -> {
                    GroupWrapperDTO groupWrapperDTO = new GroupWrapperDTO();
                    groupWrapperDTO.setGroup(toGroupDTO(groupEntity, userEntity.getId()));
                    groupWrapperDTO.setGroupCall(groupCallMapper.toGroupCall(groupEntity));
                    groupWrapperDTOS.add(groupWrapperDTO);
                }
        );
        groupWrapperDTOS.sort(new ComparatorListWrapperGroupDTO());

        Optional<GroupWrapperDTO> groupUrl = groupWrapperDTOS.stream().findFirst();
        String firstGroupUrl = groupUrl.isPresent() ? groupUrl.get().getGroup().getUrl() : "";

        userDTO.setFirstGroupUrl(firstGroupUrl);
        initUserDTO.setUser(userDTO);
        initUserDTO.setGroupsWrapper(groupWrapperDTOS);
        return initUserDTO;
    }

    public AuthUserDTO toLightUserDTO(UserEntity userEntity) {
        Set<GroupEntity> groups = userEntity.getGroupSet();
        List<GroupDTO> allUserGroups = new ArrayList<>(userEntity.getGroupSet().stream()
                .map((groupEntity) -> toGroupDTO(groupEntity, userEntity.getId())).toList());
        Optional<GroupEntity> groupUrl = groups.stream().findFirst();
        String lastGroupUrl = groupUrl.isPresent() ? groupUrl.get().getUrl() : "";
        allUserGroups.sort(new ComparatorListGroupDTO());
        return new AuthUserDTO(userEntity.getId(), userEntity.getFirstName(), userEntity.getLastName(), lastGroupUrl, userEntity.getWsToken(), userEntity.getColor(), allUserGroups);
    }

    public GroupDTO toGroupDTO(GroupEntity grp, int userId) {
        GroupDTO grpDTO = new GroupDTO();
        grpDTO.setId(grp.getId());
        grpDTO.setName(grp.getName());
        grpDTO.setUrl(grp.getUrl());
        grpDTO.setGroupType(grp.getGroupTypeEnum().toString());
        GroupUser user = groupUserJoinService.findGroupUser(userId, grp.getId());
        MessageEntity msg = messageService.findLastMessage(grp.getId());
        if (msg != null) {
            String sender = userService.findFirstNameById(msg.getUser_id());
            MessageUserEntity messageUserEntity = seenMessageService.findByMessageId(msg.getId(), userId);
            grpDTO.setLastMessageSender(sender);
            if (messageUserEntity != null) {
                if (msg.getType().equals(MessageTypeEnum.FILE.toString())) {
                    StringBuilder stringBuilder = new StringBuilder();
                    String senderName = userId == msg.getUser_id() ? "You" : sender;
                    stringBuilder.append(senderName);
                    stringBuilder.append(" ");
                    stringBuilder.append("has send a file");
                    grpDTO.setLastMessage(stringBuilder.toString());
                } else {
                    grpDTO.setLastMessage(msg.getMessage());
                }
                grpDTO.setLastMessage(msg.getMessage());
                grpDTO.setLastMessageSeen(msg.getCreatedAt().after(user.getLastMessageSeenDate()));
                grpDTO.setLastMessageDate(msg.getCreatedAt().toString());
            }
        } else {
            grpDTO.setLastMessageDate(grp.getCreatedAt().toString());
            grpDTO.setLastMessageSeen(true);
        }
        return grpDTO;
    }

    public GroupMemberDTO toGroupMemberDTO(GroupUser groupUser) {
        return new GroupMemberDTO(groupUser.getUserEntities().getId(), groupUser.getUserEntities().getFirstName(), groupUser.getUserEntities().getLastName(), groupUser.getRole() == 1);
    }
}
