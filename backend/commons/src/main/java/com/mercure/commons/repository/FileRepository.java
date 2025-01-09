package com.mercure.commons.repository;

import com.mercure.commons.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Integer> {

    FileEntity findByMessageId(int id);

    @Query(value = "SELECT storage.url FROM file_storage storage WHERE storage.fk_message_id = :id", nativeQuery = true)
    String findFileUrlByMessageId(@Param(value = "id") int id);

    @Query(value = "SELECT url FROM file_storage file INNER JOIN message m ON m.id = file.fk_message_id WHERE m.msg_group_id = :groupId", nativeQuery = true)
    List<String> findFilesUrlsByGroupId(@Param(value = "groupId") int groupId);
}
