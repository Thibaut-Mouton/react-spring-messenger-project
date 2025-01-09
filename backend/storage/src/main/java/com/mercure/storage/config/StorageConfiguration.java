package com.mercure.storage.config;

import com.mercure.storage.service.GcpStorage;
import com.mercure.storage.service.LocalStorage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
@Slf4j
public class StorageConfiguration {

    @Bean
    @ConditionalOnProperty(
            value = "storage.provider",
            havingValue = "local",
            matchIfMissing = true
    )
    @Primary
    public StorageOptions getLocalStorage() {
        log.debug("Local storage provider is configured");
        return new LocalStorage();
    }

    @Bean
    @ConditionalOnProperty(
            value = "storage.provider",
            havingValue = "gcp",
            matchIfMissing = true
    )
    public StorageOptions getGcpStorage() {
        log.info("GCP storage provider is configured");
        return new GcpStorage();
    }
}
