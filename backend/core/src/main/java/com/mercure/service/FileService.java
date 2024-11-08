package com.mercure.service;

import com.mercure.entity.FileEntity;
import com.mercure.repository.FileRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class FileService {

    private FileRepository fileRepository;

    public FileEntity save(FileEntity f) {
        return fileRepository.save(f);
    }

    public FileEntity findByFkMessageId(int id) {
        return fileRepository.findByMessageId(id);
    }

    public List<String> getFilesUrlByGroupId(int groupId) {
        return fileRepository.findFilesUrlsByGroupId(groupId);
    }

    public String findFileUrlByMessageId(int id) {
        return fileRepository.findFileUrlByMessageId(id);
    }
}
