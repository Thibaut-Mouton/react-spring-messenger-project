package com.mercure.core.service.cache;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class RoomCacheService {

    private CacheManager cacheManager;

    private Cache getCache() {
        return cacheManager.getCache("rooms");
    }

    public void setNewRoom(String roomUrl, Object object) {
        Cache roomsCache = this.getCache();
        roomsCache.put(roomUrl, object);
    }

    public List<String> getAllKeys() {
        ConcurrentHashMap<String, HashMap<String, ArrayList<Integer>>> map = (ConcurrentHashMap) this.getCache().getNativeCache();
        return Collections.list(map.keys());
    }

    public Object getRoomByKey(String groupUrl) {
        Cache roomsCache = this.getCache();
        if (roomsCache != null) {
            Cache.ValueWrapper valueWrapper = roomsCache.get(groupUrl);
            if (valueWrapper != null) {
                return valueWrapper.get();
            }
        }
        return null;
    }
}
