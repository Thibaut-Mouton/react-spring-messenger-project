package com.mercure.mapper;

import com.mercure.dto.user.GroupCallDTO;
import com.mercure.entity.GroupEntity;
import com.mercure.service.cache.RoomCacheService;
import org.junit.jupiter.api.*;


import static org.junit.jupiter.api.Assertions.*;

public class GroupCallMapperTest {

    @Test
    @DisplayName("GroupCallMapperTest")
    public void compare() {
        RoomCacheService roomCacheService = new RoomCacheService();
        GroupCallMapper groupCallMapper = new GroupCallMapper(roomCacheService);
        GroupEntity groupEntity = new GroupEntity();
        GroupCallDTO groupCallDTO = groupCallMapper.toGroupCall(groupEntity);
        assertNotEquals("", groupCallDTO.getActiveCallUrl());
    }
}