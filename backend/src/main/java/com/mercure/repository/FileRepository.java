package com.mercure.repository;

import com.mercure.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends JpaRepository<FileEntity,Integer> {

    FileEntity findByMessageId(int id);
}
