import { RtcActionEnum } from "../utils/rtc-action-enum"

export class RtcTransportDTO {

	constructor (public userId: number, public groupUrl: string, public action: RtcActionEnum, public offer?: RTCSessionDescriptionInit, public answer?: RTCSessionDescriptionInit, public iceCandidate?: RTCIceCandidate) {
		this.userId = userId
		this.groupUrl = groupUrl
		this.action = action
		this.offer = offer
		this.answer = answer
		this.iceCandidate = iceCandidate
	}
}
