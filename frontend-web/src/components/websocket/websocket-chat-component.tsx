import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Button from "@material-ui/core/Button";
import ImageIcon from "@material-ui/icons/Image";
import {CustomTextField} from "../../design/partials/custom-material-textfield";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import React, {useEffect} from "react";
import {ImagePreviewComponent} from "../../design/partials/image-preview";
import AuthService from "../../service/auth-service";
import {useThemeContext} from "../../context/theme-context";
import {useAuthContext} from "../../context/auth-context";
import {ReduxModel} from "../../model/redux-model";
import {GroupModel} from "../../model/group-model";
import {AxiosError} from "axios";
import {FullMessageModel} from "../../model/full-message-model";
import {GroupActionEnum} from "./group-action-enum";
import {TypeMessageEnum} from "../../utils/type-message-enum";
import {Box} from "@material-ui/core";
import {useLoaderContext} from "../../context/loader-context";
import {useAlertContext} from "../../context/alert-context";
import {FeedbackModel} from "../../model/feedback-model";
import UUIDv4 from "../../utils/uuid-generator";

interface WebsocketChatComponentType {
    getGroupMessages: (groupUrl: ReduxModel) => {},
    currentActiveGroup: () => {},
    sendWsMessage: (model: ReduxModel) => {},
    markMessageAsSeen: (message: string) => {},
    fetchMessages: (groupUrl: ReduxModel) => {},
    chatHistory: FullMessageModel[],
    wsUserGroups: GroupModel[],
    isWsConnected: boolean,
    groupName: string
}

export const WebSocketChatComponent: React.FunctionComponent<WebsocketChatComponentType> = ({
                                                                                                getGroupMessages,
                                                                                                currentActiveGroup,
                                                                                                sendWsMessage,
                                                                                                markMessageAsSeen,
                                                                                                fetchMessages,
                                                                                                chatHistory,
                                                                                                wsUserGroups,
                                                                                                isWsConnected,
                                                                                                groupName
                                                                                            }) => {
    const {theme} = useThemeContext();
    const {user} = useAuthContext();
    const {setLoading} = useLoaderContext();
    const {alerts, setAlerts} = useAlertContext();
    const [isPreviewImageOpen, setPreviewImageOpen] = React.useState(false);
    const [imgSrc, setImgSrc] = React.useState("");
    const [file, setFile] = React.useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string>("");
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const groupUrl: string = window.location.pathname.split("/").slice(-1)[0];
    let messageEnd: HTMLDivElement | null;

    useEffect(() => {
        if (isWsConnected) {
            fetchMessages(new ReduxModel(undefined, undefined, groupUrl, user?.id, undefined));
            setLoading(false);
        }
    }, [isWsConnected])

    useEffect(() => {
        fetchMessages(new ReduxModel(undefined, undefined, groupUrl, user?.id, undefined));
    }, [groupUrl])

    useEffect(() => {
        scrollToEnd()
    }, [chatHistory])

    function styleSelectedMessage() {
        return theme === "dark" ? "hover-msg-dark" : "hover-msg-light";
    }

    function generateImageRender(message: FullMessageModel) {
        if (message.fileUrl === undefined) {
            return null;
        }
        return (
            <div>
                <img src={message.fileUrl} height={"200px"} alt={message.name}
                     onClick={() => handleImagePreview(GroupActionEnum.OPEN, message.fileUrl)}
                     style={{border: "1px solid #c8c8c8", borderRadius: "7%"}}/>
            </div>
        )
    }

    function resetImageBuffer(event: any) {
        event.preventDefault();
        setFile(null);
        setImagePreviewUrl("");
        setImageLoaded(false);
    }

    function previewFile(event: any) {
        resetImageBuffer(event);
        let reader = new FileReader();
        let file = event.target.files[0];
        reader.readAsDataURL(file)

        reader.onload = (e) => {
            if (e.target && e.target.readyState === FileReader.DONE) {
                setFile(file);
                setImagePreviewUrl(reader.result as string);
                setImageLoaded(true);
            }
        };
    }

    function submitMessage(event: any) {
        if (message !== "") {
            console.log(event)
            if (event.key !== undefined && event.shiftKey && event.keyCode === 13) {
                return;
            }
            if (event.key !== undefined && event.keyCode === 13) {
                event.preventDefault();
                setMessage("");
                sendMessage();
            }
        }
    }

    function handleChange(event: any) {
        setMessage(event.target.value);
    }

    function sendMessage() {
        if (user?.id === null || undefined) {
            console.warn("userId is null !")
        }
        if (message !== "") {
            const reduxModel = new ReduxModel(undefined, undefined, groupUrl || "", user?.id as number, message)
            sendWsMessage(reduxModel)
            setMessage("")
        }
        if (file !== null) {
            console.log("Publishing file");
            const userId: string = String(user?.id)
            const formData = new FormData();
            formData.append("file", file)
            formData.append("userId", userId)
            formData.append("groupUrl", groupUrl || "")
            new AuthService().uploadFile(formData).then().catch((err: AxiosError) => {
                setAlerts([...alerts, new FeedbackModel(UUIDv4(), `Cannot send image : ${err.toString()}`, "error", true)])
            })
            setMessage("")
            setImageLoaded(false)
            setFile(null)
            setImagePreviewUrl("")
        }
        // updateGroupsOnMessage(groupUrl, wsUserGroups)
    }

    function scrollToEnd() {
        messageEnd?.scrollIntoView({behavior: "auto"});
    }

    function handlePopupState(isOpen: boolean) {
        setPreviewImageOpen(isOpen)
    }

    function handleImagePreview(action: string, src: string) {
        switch (action) {
            case GroupActionEnum.OPEN:
                setImgSrc(src)
                handlePopupState(true);
                break;
            case GroupActionEnum.CLOSE:
                handlePopupState(false);
                break;
            default:
                throw new Error("handleImagePreview failed");
        }
    }

    function markMessageSeen() {
        // markMessageAsSeen(groupUrl)
    }

    return (
        <div style={{display: "flex", flex: "1", flexDirection: "column"}}>
            <div style={{
                width: "100%",
                height: "50px",
                borderBottom: "1px solid gray"
            }}>
                <Box m={1}>
                    <span style={{fontSize: "20px", fontWeight: "bold"}}>{groupName}</span>
                </Box>
            </div>
            <div style={{
                backgroundColor: "transparent",
                width: "100%",
                height: "calc(100% - 56px)",
                overflowY: "scroll"
            }}>
                {/*<div style={{*/}
                {/*    width: "inherit",*/}
                {/*    boxSizing: "border-box",*/}
                {/*    height: "40px",*/}
                {/*    backgroundColor: "#5588dd",*/}
                {/*    position: "fixed",*/}
                {/*    display: "flex",*/}
                {/*    justifyContent: "center"*/}
                {/*}}>*/}
                {/*    <CircularProgress size={20}/>*/}
                {/*</div>*/}
                <ImagePreviewComponent imgSrc={imgSrc}
                                       displayImagePreview={isPreviewImageOpen}
                                       setDisplayImagePreview={handlePopupState}/>
                {chatHistory && chatHistory.map((val, index, array) => (
                    <Tooltip
                        key={index}
                        enterDelay={700}
                        leaveDelay={0}
                        title={new Date(val.time).getHours() + ":" + new Date(val.time).getMinutes()}
                        placement="left">
                        <div className={'msg ' + styleSelectedMessage()} key={index}
                             style={{display: "flex", alignItems: "center"}}>
                            {index >= 1 && array[index - 1].userId === array[index].userId ?
                                <div style={{
                                    width: "40px",
                                    height: "40px",
                                }}/>
                                :
                                <div style={{
                                    fontFamily: "Segoe UI,SegoeUI,\"Helvetica Neue\",Helvetica,Arial,sans-serif",
                                    backgroundColor: `${val.color}`,
                                    letterSpacing: "1px",
                                    width: "40px",
                                    height: "40px",
                                    textAlign: "center",
                                    fontSize: "20px",
                                    borderRadius: " 50%",
                                    border: "1px solid gray",
                                    lineHeight: "37px"
                                }}>
                                    <div style={{color: "#FFFFFF"}}>{val.initials}</div>
                                </div>
                            }
                            <div style={{margin: "4px"}}>
                                {index >= 1 && array[index - 1].userId === array[index].userId ?
                                    <div/>
                                    :
                                    <div>
                                        <b>{val.sender} </b>
                                    </div>
                                }
                                {
                                    val.type === TypeMessageEnum.TEXT ?
                                        <div>
                                            {val.message}
                                        </div>
                                        :
                                        <div>
                                            {generateImageRender(val)}
                                        </div>
                                }
                            </div>
                        </div>
                    </Tooltip>
                ))}
                <div style={{float: "left", clear: "both"}}
                     ref={(el) => {
                         messageEnd = el;
                     }}>
                </div>
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{boxSizing: "border-box", borderBottom: "0.5px solid #C8C8C8"}}>
                    {
                        imagePreviewUrl &&
                        <div style={{
                            padding: "10px",
                            height: "120px",
                            maxWidth: "120px",
                            background: "url('" + imagePreviewUrl + "')",
                            backgroundSize: "cover",
                            position: "relative",
                            borderRadius: "10%"
                        }}>
                            <IconButton style={{
                                height: "20px",
                                position: "absolute",
                                right: "8px",
                                top: "8px",
                                width: "20px"
                            }}
                                        onClick={event => resetImageBuffer(event)}>
                                <HighlightOffIcon/>
                            </IconButton>
                        </div>
                    }
                </div>
                <div style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    position: "relative",
                    bottom: "0",
                    padding: "5px"
                }}>
                    <input
                        accept="image/*"
                        style={{display: 'none'}}
                        id="raised-button-file"
                        multiple
                        type="file"
                        onChange={event => previewFile(event)}
                    />
                    {/*<Button onClick={event => openCallPage(event)} variant="text" component="span">*/}
                    {/*    <CallIcon/>*/}
                    {/*</Button>*/}
                    {/*<Button onClick={event => openCallPage(event)} variant="text" component="span">*/}
                    {/*    <AcUnitIcon/>*/}
                    {/*</Button>*/}
                    {/*<CallWindowContainer/>*/}
                    <label htmlFor="raised-button-file">
                        <Button variant="text" component="span">
                            <ImageIcon/>
                        </Button>
                    </label>
                    <CustomTextField
                        id={"inputChatMessenger"}
                        label={"Write a message"}
                        value={message}
                        onClick={markMessageSeen}
                        handleChange={(event: any) => handleChange(event)}
                        type={"text"}
                        keyUp={submitMessage}
                        isMultiline={true}
                        isDarkModeEnable={theme}
                        name={"mainWriteMessage"}/>
                    <Button
                        onClick={sendMessage}
                        variant="contained"
                        color="primary"
                        style={{
                            marginLeft: "3px",
                            maxWidth: "20px"
                        }}
                        disabled={!imageLoaded && message === ""}
                    >
                        <DoubleArrowIcon/>
                    </Button>
                </div>
            </div>
        </div>
    )
}