package com.mercure.mapper;

import com.mercure.dto.user.GroupCallDTO;
import com.mercure.entity.GroupEntity;
import com.mercure.service.cache.RoomCacheService;
import org.junit.Test;

import static org.junit.Assert.assertNotEquals;


public class GroupCallMapperTest {

    @Test
    public void compare() {
        RoomCacheService roomCacheService = new RoomCacheService();
        GroupCallMapper groupCallMapper = new GroupCallMapper(roomCacheService);
        GroupEntity groupEntity = new GroupEntity();
        GroupCallDTO groupCallDTO = groupCallMapper.toGroupCall(groupEntity);
        assertNotEquals("", groupCallDTO.getActiveCallUrl());
    }
}