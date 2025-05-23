package com.mercure.core.service;

import com.mercure.commons.entity.GroupRoleKey;
import com.mercure.commons.entity.GroupUser;
import com.mercure.core.repository.GroupRepository;
import com.mercure.core.repository.GroupUserJoinRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class GroupUserJoinService {

    private static final Logger log = LoggerFactory.getLogger(GroupUserJoinService.class);

    private GroupUserJoinRepository groupUserJoinRepository;

    private GroupRepository groupRepository;

    public GroupUser save(GroupUser groupUser) {
        return groupUserJoinRepository.save(groupUser);
    }

    public void saveAll(List<GroupUser> groups) {
        try {
            groupUserJoinRepository.saveAll(groups);
        } catch (Exception e) {
            log.error("Cannot save user for conversation : {}", e.getMessage());
        }
    }

    public Optional<GroupUser> findById(GroupRoleKey id) {
        return groupUserJoinRepository.findById(id);
    }

    public List<GroupUser> findAll() {
        return groupUserJoinRepository.findAll();
    }

    public List<GroupUser> findAllByGroupId(int groupId) {
        return groupUserJoinRepository.getAllByGroupId(groupId);
    }

    public List<Integer> findAllGroupsByUserId(int userId) {
        return groupUserJoinRepository.getGroupUserByUserId(userId);
    }

    public GroupUser findGroupUser(int userId, int groupId) {
        return groupUserJoinRepository.getGroupUser(userId, groupId);
    }

    public void saveLastMessageDate(int userId, String groupUrl) {
        int groupId = groupRepository.findGroupByUrl(groupUrl);
        GroupUser groupUser = groupUserJoinRepository.getGroupUser(userId, groupId);
        Date date = new Date();
        Timestamp ts = new Timestamp(date.getTime());
        groupUser.setLastMessageSeenDate(ts);
    }

    public boolean checkIfUserIsAuthorizedInGroup(int userId, int groupId) {
        List<Integer> ids = groupUserJoinRepository.getUsersIdInGroup(groupId);
        return ids.stream().noneMatch(id -> id == userId);
    }


    public GroupUser grantUserAdminInConversation(int userId, int groupId) {
        return executeActionOnGroupUser(userId, groupId, 1);
    }

    public void removeUserAdminFromConversation(int userIdToDelete, int groupId) {
        executeActionOnGroupUser(userIdToDelete, groupId, 0);
    }

    private GroupUser executeActionOnGroupUser(int userId, int groupId, int role) {
        GroupRoleKey groupRoleKey = new GroupRoleKey(groupId, userId);
        Optional<GroupUser> optionalGroupUserToDelete = groupUserJoinRepository.findById(groupRoleKey);
        if (optionalGroupUserToDelete.isPresent()) {
            GroupUser groupUser = optionalGroupUserToDelete.get();
            groupUser.setRole(role);
            return groupUserJoinRepository.save(groupUser);
        }
        return null;
    }

    public void removeUserFromConversation(int userIdToDelete, int groupId) {
        GroupRoleKey groupRoleKey = new GroupRoleKey(groupId, userIdToDelete);
        try {
            Optional<GroupUser> optionalGroupUserToDelete = groupUserJoinRepository.findById(groupRoleKey);
            optionalGroupUserToDelete.ifPresent(groupUser -> groupUserJoinRepository.delete(groupUser));
            List<Integer> usersId = groupUserJoinRepository.getUsersIdInGroup(groupId);
            if (usersId.isEmpty()) {
                log.info("All users have left the group [groupId => {}]. Deleting messages...", groupId);
                // TODO fix circular dependency
//                messageService.deleteAllMessagesByGroupId(groupId);
                log.info("All messages have been successfully deleted");
            }
        } catch (Exception exception) {
            log.error("Error occurred during user removal : {}", exception.getMessage());
        }
    }
}
