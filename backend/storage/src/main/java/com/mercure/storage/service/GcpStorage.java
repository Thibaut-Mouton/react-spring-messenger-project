package com.mercure.storage.service;

import com.mercure.storage.config.StorageOptions;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class GcpStorage implements StorageOptions {

    @Override
    public void deleteFile() {

    }

    @Override
    public void uploadFile(File file) {

    }

    @Override
    public void downloadFile(File file) {

    }
}
