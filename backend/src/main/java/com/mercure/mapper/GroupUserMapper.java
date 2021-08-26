package com.mercure.mapper;

import com.mercure.dto.GroupMemberDTO;
import com.mercure.entity.GroupUser;
import org.springframework.stereotype.Service;

@Service
public class GroupUserMapper {

    public GroupMemberDTO toGroupMemberDTO(GroupUser groupUser) {
        GroupMemberDTO dto = new GroupMemberDTO();
        dto.setAdmin(groupUser.getRole() == 1);
        if (groupUser.getUserMapping() != null) {
            dto.setUserId(groupUser.getUserMapping().getId());
            dto.setFirstName(groupUser.getUserMapping().getFirstName());
            dto.setLastName(groupUser.getUserMapping().getLastName());
        }
        return dto;
    }
}
