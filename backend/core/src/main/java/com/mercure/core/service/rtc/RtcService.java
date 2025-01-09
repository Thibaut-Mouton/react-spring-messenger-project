package com.mercure.core.service.rtc;

import com.mercure.commons.dto.RtcTransportDTO;
import com.mercure.commons.entity.GroupUser;
import com.mercure.core.service.GroupService;
import com.mercure.core.service.GroupUserJoinService;
import com.mercure.core.service.cache.CallsCacheService;
import com.mercure.core.service.cache.RoomCacheService;
import com.mercure.commons.utils.RtcActionEnum;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class RtcService {

    private final Logger log = LoggerFactory.getLogger(RtcService.class);

    private GroupUserJoinService groupUserJoinService;

    private GroupService groupService;

    private RoomCacheService roomCacheService;

    private CallsCacheService callsCacheService;

    private SimpMessagingTemplate messagingTemplate;

    public Object getOfferFromRoom(String roomUrl) {
        return this.roomCacheService.getRoomByKey(roomUrl);
    }

    public Object showCache() {
        return this.callsCacheService.getAll();
    }

    public void addUserInCallRoom(String roomUrl, String userSessionId) {
    }

    public void setUser(String callUrl, int userId) {
        this.callsCacheService.setUser(callUrl, userId);
    }

    public void removeUser(String callUrl, int userId) {
        this.callsCacheService.removeUser(callUrl, userId);
    }

    public boolean isRoomAlreadyExists(String roomUrl) {
        return this.roomCacheService.getRoomByKey(roomUrl) != null;
    }

    public void storeOffer(String roomUrl, Object offer) {
        this.roomCacheService.setNewRoom(roomUrl, offer);
    }

    public void handleRtcAction(RtcActionEnum action, String roomUrl, String sessionID, RtcTransportDTO dto) {
        switch (action) {
            case LEAVE_ROOM -> {
                log.warn("User left room {}", dto.getUserId());
                this.removeUser(roomUrl, dto.getUserId());
            }
            case INIT_ROOM -> {
                this.setUser(roomUrl, dto.getUserId());
                if (this.isRoomAlreadyExists(roomUrl)) {
                    Object offer = this.getOfferFromRoom(roomUrl);
                    RtcTransportDTO rtcTransportDTO = new RtcTransportDTO();
                    rtcTransportDTO.setUserId(dto.getUserId());
                    rtcTransportDTO.setAction(RtcActionEnum.JOIN_ROOM);
                    rtcTransportDTO.setOffer(offer);
                    this.messagingTemplate.convertAndSend("/topic/rtc/" + dto.getUserId(), rtcTransportDTO);
                }
                Object offer = dto.getOffer();
                if (offer != null) {
                    this.storeOffer(roomUrl, offer);
                }
            }
            case SEND_ANSWER -> {
                RtcTransportDTO rtcTransportDTO = new RtcTransportDTO();
                rtcTransportDTO.setUserId(dto.getUserId());
                rtcTransportDTO.setAction(RtcActionEnum.RECEIVE_ANSWER);
                rtcTransportDTO.setAnswer(dto.getAnswer());
                int groupId = groupService.findGroupByUrl(dto.getGroupUrl());
                List<GroupUser> groupUsers = groupUserJoinService.findAllByGroupId(groupId);
                groupUsers.stream()
                        .map(GroupUser::getUserId)
                        .filter((userId) -> !userId.equals(dto.getUserId()))
                        .forEach(toUserId -> this.messagingTemplate.convertAndSend("/topic/rtc/" + toUserId, rtcTransportDTO));
            }
            case ICE_CANDIDATE -> {
                RtcTransportDTO rtcTransportDTO = new RtcTransportDTO();
                rtcTransportDTO.setUserId(dto.getUserId());
                rtcTransportDTO.setAction(RtcActionEnum.ICE_CANDIDATE);
                rtcTransportDTO.setIceCandidate(dto.getIceCandidate());
                int groupId = groupService.findGroupByUrl(dto.getGroupUrl());
                List<GroupUser> groupUsers = groupUserJoinService.findAllByGroupId(groupId);
                groupUsers.stream()
                        .map(GroupUser::getUserId)
                        .filter((userId) -> !userId.equals(dto.getUserId()))
                        .forEach(toUserId -> this.messagingTemplate.convertAndSend("/topic/rtc/" + toUserId, rtcTransportDTO));
            }
            default -> log.warn("Unknown action : {}", dto.getAction());
        }
    }
}
