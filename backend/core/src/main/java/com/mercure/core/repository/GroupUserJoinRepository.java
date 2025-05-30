package com.mercure.core.repository;

import com.mercure.commons.entity.GroupRoleKey;
import com.mercure.commons.entity.GroupUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupUserJoinRepository extends JpaRepository<GroupUser, GroupRoleKey> {

    @Query(value = "SELECT * FROM group_user WHERE group_id=:groupId", nativeQuery = true)
    List<GroupUser> getAllByGroupId(@Param("groupId") int groupId);

    @Query(value = "SELECT group_id FROM group_user WHERE user_id= :userId", nativeQuery = true)
    List<Integer> getGroupUserByUserId(@Param("userId") int userId);

    @Query(value = "SELECT * FROM group_user WHERE group_id=:groupId and user_id = :userId", nativeQuery = true)
    GroupUser getGroupUser(@Param("userId") int userId, @Param("groupId") int groupId);

    @Query(value = "SELECT g.user_id FROM group_user g WHERE g.group_id = :groupId", nativeQuery = true)
    List<Integer> getUsersIdInGroup(@Param("groupId") int groupId);
}
