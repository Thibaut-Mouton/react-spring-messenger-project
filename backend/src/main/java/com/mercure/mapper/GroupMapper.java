package com.mercure.mapper;

import com.mercure.dto.user.GroupDTO;
import com.mercure.dto.GroupMemberDTO;
import com.mercure.entity.*;
import com.mercure.service.*;
import com.mercure.utils.MessageTypeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
                if (msg.getType().equals(MessageTypeEnum.FILE.toString())) {
                    StringBuilder stringBuilder = new StringBuilder();
                    String senderName = userId == msg.getUser_id() ? "You" : sender;
                    stringBuilder.append(senderName);
                    stringBuilder.append(" ");
                    stringBuilder.append("have send a file");
                    grpDTO.setLastMessage(stringBuilder.toString());
                } else {
                    grpDTO.setLastMessage(msg.getMessage());
                }
                grpDTO.setLastMessage(msg.getMessage());
                grpDTO.setLastMessageSeen(messageUserEntity.isSeen());
                grpDTO.setLastMessageDate(msg.getCreatedAt().toString());
            }
        } else {
            grpDTO.setLastMessageDate(grp.getCreatedAt().toString());
            grpDTO.setLastMessageSeen(true);
        }
        return grpDTO;
    }

    public GroupMemberDTO toGroupMemberDTO(GroupUser groupUser) {
        return new GroupMemberDTO(groupUser.getUserMapping().getId(), groupUser.getUserMapping().getFirstName(), groupUser.getUserMapping().getLastName(), groupUser.getRole() == 1);
    }
}
