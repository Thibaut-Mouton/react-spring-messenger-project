package com.mercure.service;

import com.mercure.dto.GroupMemberDTO;
import com.mercure.entity.*;
import com.mercure.repository.GroupRepository;
import com.mercure.utils.GroupTypeEnum;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GroupService {

    private static Logger log = LoggerFactory.getLogger(GroupService.class);

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private GroupUserJoinService groupUserJoinService;

    public int findGroupByUrl(String url) {
        return groupRepository.findGroupByUrl(url);
    }

    public String getGroupName(String url) {
        return groupRepository.getGroupEntitiesBy(url);
    }

    public String getGroupUrlById(int id) {
        return groupRepository.getGroupUrlById(id);
    }

    public GroupMemberDTO addUserToConversation(int userId, int groupId) {
        Optional<GroupEntity> groupEntity = groupRepository.findById(groupId);
        if (groupEntity.isPresent() && groupEntity.orElse(null).getGroupTypeEnum().equals(GroupTypeEnum.SINGLE)) {
            log.info("Cannot add user in a single conversation");
            return new GroupMemberDTO();
        }
        UserEntity user = userService.findById(userId);
        GroupUser groupUser = new GroupUser();
        groupUser.setGroupMapping(groupEntity.orElse(null));
        groupUser.setUserMapping(user);
        groupUser.setGroupId(groupId);
        groupUser.setUserId(userId);
        groupUser.setRole(0);
        GroupUser saved = groupUserJoinService.save(groupUser);
        assert groupEntity.orElse(null) != null;
        groupEntity.orElse(null).getGroupUsers().add(saved);
        groupRepository.save(groupEntity.orElse(null));
        return new GroupMemberDTO(user.getId(), user.getFirstName(), user.getLastName(), false);
    }

    public GroupUser createGroup(int userId, String name) {
        GroupUser groupUser = new GroupUser();
        GroupEntity group = new GroupEntity(name);
        group.setName(name);
        group.setUrl(UUID.randomUUID().toString());
        group.setGroupTypeEnum(GroupTypeEnum.GROUP);
        GroupEntity savedGroup = groupRepository.save(group);
        UserEntity user = userService.findById(userId);
        GroupRoleKey groupRoleKey = new GroupRoleKey();
        groupRoleKey.setUserId(userId);
        groupRoleKey.setGroupId(savedGroup.getId());
//        groupUser.setId(groupRoleKey);
        groupUser.setGroupId(savedGroup.getId());
        groupUser.setUserId(userId);
        groupUser.setRole(1);
        groupUser.setUserMapping(user);
        groupUser.setGroupMapping(group);
        return groupUserJoinService.save(groupUser);
    }

    public Optional<GroupEntity> findById(int groupId) {
        return groupRepository.findById(groupId);
    }

    public void createConversation(int id1, int id2) {
        GroupEntity groupEntity = new GroupEntity();
        groupEntity.setName(null);
        groupEntity.setUrl(UUID.randomUUID().toString());
        groupEntity.setGroupTypeEnum(GroupTypeEnum.SINGLE);
        GroupEntity savedGroup = groupRepository.save(groupEntity);

        UserEntity user1 = userService.findById(id1);
        UserEntity user2 = userService.findById(id2);

        GroupUser groupUser1 = new GroupUser();
//        groupUser1.setId(new GroupRoleKey(savedGroup.getId(), id1));
        groupUser1.setGroupId(savedGroup.getId());
        groupUser1.setUserId(id1);

        groupUser1.setRole(0);
        groupUser1.setUserMapping(user1);
        groupUser1.setGroupMapping(groupEntity);

        GroupUser groupUser2 = new GroupUser();
//        groupUser2.setId(new GroupRoleKey(savedGroup.getId(), id2));
        groupUser2.setUserId(savedGroup.getId());
        groupUser2.setGroupId(id2);
        groupUser2.setRole(0);
        groupUser2.setUserMapping(user2);
        groupUser2.setGroupMapping(groupEntity);
        groupUserJoinService.save(groupUser1);
        groupUserJoinService.save(groupUser2);

    }
}
