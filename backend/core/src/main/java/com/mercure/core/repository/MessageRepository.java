package com.mercure.core.repository;

import com.mercure.commons.dto.search.FullTextSearchDatabaseResponse;
import com.mercure.commons.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, Integer> {

    @Query(value = "SELECT * FROM (SELECT * FROM message m WHERE m.msg_group_id=:id and ((:offset > 0 and m.id < :offset) or (:offset <= 0)) ORDER BY m.id DESC LIMIT 20)t order by id", nativeQuery = true)
    List<MessageEntity> findByGroupIdAndOffset(@Param(value = "id") int id, @Param(value = "offset") int offset);

    @Query(value = "SELECT * FROM (SELECT * FROM message m WHERE m.msg_group_id=:id ORDER BY m.id DESC LIMIT 20)t order by id", nativeQuery = true)
    List<MessageEntity> findLastMessagesByGroupId(@Param(value = "id") int id);

    @Query(value = "SELECT * FROM message m1 INNER JOIN (SELECT MAX(m.id) as mId FROM message m GROUP BY m.msg_group_id) temp ON temp.mId = m1.id WHERE msg_group_id = :idOfGroup", nativeQuery = true)
    MessageEntity findLastMessageByGroupId(@Param(value = "idOfGroup") int groupId);

    @Query(value = "SELECT m1.id FROM message m1 INNER JOIN (SELECT MAX(m.id) as id FROM message m GROUP BY m.msg_group_id) temp ON temp.id = m1.id WHERE msg_group_id = :idOfGroup", nativeQuery = true)
    int findLastMessageIdByGroupId(@Param(value = "idOfGroup") int groupId);

    @Query(value = "SELECT m.message as message, c.id, c.url as groupUrl, c.name as groupName FROM message m LEFT JOIN chat_group c ON c.id = m.msg_group_id WHERE m.msg_group_id IN :groupIds AND m.message LIKE %:searchQuery%", nativeQuery = true)
    List<FullTextSearchDatabaseResponse> findMessagesBySearchQuery(@Param(value = "searchQuery") String searchQuery, @Param(value = "groupIds") List<Integer> groupIds);

    @Modifying
    @Query(value = "DELETE m, mu FROM message m JOIN message_user mu ON m.id = mu.message_id WHERE m.msg_group_id = :groupId", nativeQuery = true)
    void deleteMessagesDataByGroupId(@Param(value = "groupId") int groupId);
}
