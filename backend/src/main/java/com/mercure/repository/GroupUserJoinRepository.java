package com.mercure.repository;

import com.mercure.entity.GroupRoleKey;
import com.mercure.entity.GroupUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupUserJoinRepository extends JpaRepository<GroupUser, GroupRoleKey> {

    @Query(value = "SELECT * FROM group_user WHERE group_id=:groupId", nativeQuery = true)
    List<GroupUser> getAllByGroupId(@Param("groupId") int groupId);

    @Query(value = "SELECT g.user_id FROM group_user g WHERE g.group_id = :groupId", nativeQuery = true)
    List<Integer> getUsersIdInGroup(@Param("groupId") int groupId);
}
