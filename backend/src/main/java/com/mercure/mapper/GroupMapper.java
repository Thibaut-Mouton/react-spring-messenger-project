package com.mercure.mapper;

import com.mercure.dto.GroupDTO;
import com.mercure.dto.GroupMemberDTO;
import com.mercure.entity.GroupEntity;
import com.mercure.entity.GroupUser;
import com.mercure.entity.MessageEntity;
import com.mercure.entity.MessageUserEntity;
import com.mercure.service.MessageService;
import com.mercure.service.UserSeenMessageService;
import com.mercure.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupMapper {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserSeenMessageService seenMessageService;

    @Autowired
    private UserService userService;

    public GroupDTO toGroupDTO(GroupEntity grp, int userId) {
        GroupDTO grpDTO = new GroupDTO();
        grpDTO.setId(grp.getId());
        grpDTO.setName(grp.getName());
        grpDTO.setUrl(grp.getUrl());
        grpDTO.setGroupType(grp.getGroupTypeEnum().toString());
        MessageEntity msg = messageService.findLastMessage(grp.getId());
        if (msg != null) {
            String sender = userService.findFirstNameById(msg.getUser_id());
            MessageUserEntity messageUserEntity = seenMessageService.findByMessageId(msg.getId(), userId);
            grpDTO.setLastMessageSender(sender);
            if (messageUserEntity != null) {
                grpDTO.setLastMessage(msg.getMessage());
                grpDTO.setLastMessageDate(msg.getCreatedAt().toString());
                grpDTO.setLastMessageSeen(messageUserEntity.getSeen());
            }
        } else {
            grpDTO.setLastMessageSeen(true);
        }
        return grpDTO;
    }

    public GroupMemberDTO toGroupMemberDTO(GroupUser groupUser) {
        return new GroupMemberDTO(groupUser.getUserMapping().getId(), groupUser.getUserMapping().getFirstName(), groupUser.getUserMapping().getLastName(), groupUser.getRole() == 1);
    }
}
