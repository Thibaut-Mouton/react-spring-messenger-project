package com.mercure.repository;

import com.mercure.entity.GroupEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepository extends JpaRepository<GroupEntity, Integer> {

    @Query(value = "SELECT g.id FROM chat_group g WHERE g.url = :url", nativeQuery = true)
    int findGroupByUrl(@Param(value = "url") String url);

    @Query(value = "SELECT g.name FROM chat_group g WHERE g.url = :url", nativeQuery = true)
    String getGroupEntitiesBy(@Param(value = "url") String url);

    @Query(value = "SELECT g.url FROM chat_group g WHERE g.id = :id", nativeQuery = true)
    String getGroupUrlById(@Param(value = "id") Integer id);
}
