package com.mercure.core.service;

import com.mercure.commons.dto.GroupMemberDTO;
import com.mercure.commons.entity.GroupEntity;
import com.mercure.commons.entity.GroupRoleKey;
import com.mercure.commons.entity.GroupUser;
import com.mercure.commons.entity.UserEntity;
import com.mercure.core.repository.GroupRepository;
import com.mercure.core.repository.UserRepository;
import com.mercure.commons.utils.GroupTypeEnum;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class GroupService {

    private static final Logger log = LoggerFactory.getLogger(GroupService.class);

    private GroupRepository groupRepository;

    private UserRepository userRepository;

    private GroupUserJoinService groupUserJoinService;

    public int findGroupByUrl(String url) {
        return groupRepository.findGroupByUrl(url);
    }

    public GroupEntity getGroupByUrl(String url) {
        return groupRepository.getGroupByUrl(url);
    }

    public List<Integer> getAllUsersIdByGroupUrl(String groupUrl) {
        int groupId = groupRepository.findGroupByUrl(groupUrl);
        List<GroupUser> users = groupUserJoinService.findAllByGroupId(groupId);
        return users.stream().map(GroupUser::getUserId).collect(Collectors.toList());
    }

    public void saveGroup(GroupEntity group) {
        try {
            groupRepository.save(group);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
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
        UserEntity user = findUserById(userId);
        GroupUser groupUser = new GroupUser();
        groupUser.setGroupUsers(groupEntity.orElse(null));
        groupUser.setUserEntities(user);
        groupUser.setGroupId(groupId);
        groupUser.setUserId(userId);
        Date date = new Date();
        Timestamp ts = new Timestamp(date.getTime());
        groupUser.setLastMessageSeenDate(ts);
        groupUser.setRole(0);
        GroupUser saved = groupUserJoinService.save(groupUser);
        assert groupEntity.orElse(null) != null;
        groupEntity.orElse(null).getGroupUsers().add(saved);
        groupRepository.save(groupEntity.orElse(null));
        return new GroupMemberDTO(user.getId(), user.getFirstName(), user.getLastName(), false);
    }

    public GroupEntity createGroup(int userId, String name) {
        GroupUser groupUser = new GroupUser();
        GroupEntity group = new GroupEntity(name);
        group.setName(name);
        group.setUrl(UUID.randomUUID().toString());
        group.setGroupTypeEnum(GroupTypeEnum.GROUP);
        GroupEntity savedGroup = groupRepository.save(group);
        UserEntity user = findUserById(userId);
        GroupRoleKey groupRoleKey = new GroupRoleKey();
        groupRoleKey.setUserId(userId);
        groupRoleKey.setGroupId(savedGroup.getId());
        groupUser.setGroupId(savedGroup.getId());
        Date date = new Date();
        Timestamp ts = new Timestamp(date.getTime());
        groupUser.setLastMessageSeenDate(ts);
        groupUser.setUserId(userId);
        groupUser.setRole(1);
        groupUser.setUserEntities(user);
        groupUser.setGroupUsers(group);
        groupUserJoinService.save(groupUser);
        return savedGroup;
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

        UserEntity user1 = findUserById(id1);
        UserEntity user2 = findUserById(id2);

        GroupUser groupUser1 = new GroupUser();
        groupUser1.setGroupId(savedGroup.getId());
        groupUser1.setUserId(id1);

        groupUser1.setRole(0);
        groupUser1.setUserEntities(user1);
        groupUser1.setGroupUsers(groupEntity);

        GroupUser groupUser2 = new GroupUser();
        groupUser2.setUserId(savedGroup.getId());
        groupUser2.setGroupId(id2);
        groupUser2.setRole(0);
        groupUser2.setUserEntities(user2);
        groupUser2.setGroupUsers(groupEntity);
        groupUserJoinService.saveAll(Arrays.asList(groupUser1, groupUser2));
    }

    public void deleteGroup() {
        // TODO delete messages
        // TODO delete group
        // TODO delete multimedia
        // TODO user join service
    }

    // TODO fix circular dependency
    private UserEntity findUserById(int id) {
        return userRepository.findById(id).orElse(null);
    }
}
