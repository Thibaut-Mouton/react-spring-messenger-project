package com.mercure.storage.config;

import java.io.File;

public interface StorageOptions {

    void deleteFile();

    void uploadFile(File file);

    void downloadFile(File file);
}
