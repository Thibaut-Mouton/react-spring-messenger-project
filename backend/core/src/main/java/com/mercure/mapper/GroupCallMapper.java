package com.mercure.mapper;

import com.mercure.dto.user.GroupCallDTO;
import com.mercure.entity.GroupEntity;
import com.mercure.service.cache.RoomCacheService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class GroupCallMapper {

    private RoomCacheService roomCacheService;

    public GroupCallDTO toGroupCall(GroupEntity group) {
        // TODO cache room
//        List<String> keys = roomCacheService.getAllKeys();
        List<String> keys = new ArrayList<>();
        GroupCallDTO groupCallDTO = new GroupCallDTO();
        Optional<String> actualRoomKey =
                keys.stream().filter((key) -> {
                    String[] roomKey = key.split("_");
                    return group.getUrl().equals(roomKey[0]);
                }).findFirst();
        if (actualRoomKey.isPresent()) {
            groupCallDTO.setAnyCallActive(true);
            groupCallDTO.setActiveCallUrl(actualRoomKey.get().split("_")[1]);
        } else {
            groupCallDTO.setAnyCallActive(false);
        }
        return groupCallDTO;
    }
}
