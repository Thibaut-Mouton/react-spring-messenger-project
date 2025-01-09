package com.mercure.core.service.cache;

import lombok.AllArgsConstructor;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class CallsCacheService {

    private CacheManager cacheManager;

    private Cache getCache() {
        return cacheManager.getCache("calls");
    }

    public Object getAll() {
        return this.getCache();
    }

    public void setUser(String callUrl, int userId) {
        Cache cache = this.getCache();
        Cache.ValueWrapper value = cache.get(callUrl);
        if (value != null && value.get() != null) {
            ArrayList<Integer> userIds = (ArrayList<Integer>) value.get();
            assert userIds != null;
            if (!userIds.contains(userId)) {
                userIds.add(userId);
                cache.put(callUrl, userIds);
            }
        } else {
            cache.put(callUrl, new ArrayList<>(List.of(userId)));
        }
    }

    public boolean removeUser(String callUrl, int userId) {
        Cache cache = this.getCache();
        Cache.ValueWrapper value = cache.get(callUrl);
        if (value != null && value.get() != null) {
            ArrayList<Integer> userIds = (ArrayList<Integer>) value.get();
            assert userIds != null;
            userIds.remove(userId);
            return userIds.isEmpty();
        }
        return false;
    }
}
