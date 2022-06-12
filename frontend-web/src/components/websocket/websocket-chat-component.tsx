import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import CallIcon from '@mui/icons-material/Call'
import ImageIcon from '@mui/icons-material/Image'
import { Box, Button, CircularProgress, IconButton, Tooltip } from '@mui/material'
import { AxiosError } from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GroupActionEnum } from './group-action-enum'
import { useAlertContext } from '../../context/alert-context'
import { useAuthContext } from '../../context/auth-context'
import { useLoaderContext } from '../../context/loader-context'
import { useThemeContext } from '../../context/theme-context'
import { useWebSocketContext } from '../../context/ws-context'
import { CustomTextField } from '../../design/partials/custom-material-textfield'
import { ImagePreviewComponent } from '../../design/partials/image-preview'
import AuthService from '../../service/auth-service'
import { FullMessageModel } from '../../model/full-message-model'
import { getPayloadSize } from '../../utils/string-size-calculator'
import { TransportActionEnum } from '../../utils/transport-action-enum'
import { TypeMessageEnum } from '../../utils/type-message-enum'
import { FeedbackModel } from '../../model/feedback-model'
import UUIDv4 from '../../utils/uuid-generator'
import { fetchGroupMessages, markMessageAsSeen } from '../../reducers'
import { StoreState } from '../../reducers/types'
import { NoDataComponent } from '../no-data-component'
import { TransportModel } from '../../model/transport-model'
import { CallWindowComponent } from './call-window-component'

export const WebSocketChatComponent: React.FunctionComponent = () => {
  const { theme } = useThemeContext()
  const { user } = useAuthContext()
  const { ws } = useWebSocketContext()
  const { setLoading } = useLoaderContext()
  const {
    wsUserGroups
  } = useSelector(
    (state: StoreState) => state.globalReducer
  )
  const {
    alerts,
    setAlerts
  } = useAlertContext()
  const [isPreviewImageOpen, setPreviewImageOpen] = React.useState(false)
  const dispatch = useDispatch()
  const [messageId, setLastMessageId] = React.useState(0)
  const [loadingOldMessages, setLoadingOldMessages] = React.useState<boolean>(false)

  const [imgSrc, setImgSrc] = React.useState('')
  const [file, setFile] = React.useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string>('')
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const groupUrl = window.location.pathname.split('/').slice(-1)[0]
  let messageEnd: HTMLDivElement | null

  const {
    isWsConnected,
    chatHistory,
    allMessagesFetched,
    currentActiveGroup,
    currentGroupName,
    userId
  } = useSelector(
    (state: StoreState) => state.globalReducer
  )

  useEffect(() => {
    if (isWsConnected && groupUrl !== '' && ws) {
      const transport = new TransportModel(userId || 0, TransportActionEnum.FETCH_GROUP_MESSAGES, undefined, groupUrl, undefined, -1)
      ws.publish({
        destination: '/app/message',
        body: JSON.stringify(transport)
      })
      setLoading(false)
    }
  }, [isWsConnected])

  useEffect(() => {
    dispatch(fetchGroupMessages({
      messageId
    }))
  }, [groupUrl])

  useEffect(() => {
    if (!loadingOldMessages) {
      scrollToEnd()
    }
    setLoadingOldMessages(false)
    if (chatHistory && chatHistory.length > 0) {
      setLastMessageId(chatHistory[0].id)
    }
  }, [chatHistory])

  function styleSelectedMessage () {
    return theme === 'dark' ? 'hover-msg-dark' : 'hover-msg-light'
  }

  function generateImageRender (message: FullMessageModel) {
    if (message.fileUrl === undefined) {
      return null
    }
    return (
      <div>
        <img src={message.fileUrl} height={'200px'} alt={message.name}
             onClick={() => handleImagePreview(GroupActionEnum.OPEN, message.fileUrl)}
             style={{
               border: '1px solid #c8c8c8',
               borderRadius: '7%'
             }}/>
      </div>
    )
  }

  function resetImageBuffer (event: any) {
    event.preventDefault()
    setFile(null)
    setImagePreviewUrl('')
    setImageLoaded(false)
  }

  function previewFile (event: any) {
    resetImageBuffer(event)
    const reader = new FileReader()
    const file = event.target.files[0]
    reader.readAsDataURL(file)

    reader.onload = (e) => {
      if (e.target && e.target.readyState === FileReader.DONE) {
        setFile(file)
        setImagePreviewUrl(reader.result as string)
        setImageLoaded(true)
      }
    }
  }

  function submitMessage (event: any) {
    if (message !== '') {
      if (event.key !== undefined && event.shiftKey && event.keyCode === 13) {
        return
      }
      if (event.key !== undefined && event.keyCode === 13) {
        event.preventDefault()
        setMessage('')
        sendMessage()
      }
    }
  }

  function handleChange (event: any) {
    setMessage(event.target.value)
  }

  function sendMessage () {
    if (message !== '') {
      if (getPayloadSize(message) < 8192 && ws && ws.active) {
        const transport = new TransportModel(userId || 0, TransportActionEnum.SEND_GROUP_MESSAGE, undefined, currentActiveGroup, message)
        ws.publish({
          destination: '/app/message',
          body: JSON.stringify(transport)
        })
      }
      setMessage('')
    }
    if (file !== null) {
      const userId: string = String(user?.id)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId)
      formData.append('groupUrl', groupUrl || '')
      new AuthService().uploadFile(formData).then().catch((err: AxiosError) => {
        setAlerts([...alerts, new FeedbackModel(UUIDv4(), `Cannot send image : ${err.toString()}`, 'error', true)])
      })
      setMessage('')
      setImageLoaded(false)
      setFile(null)
      setImagePreviewUrl('')
    }
  }

  function scrollToEnd () {
    messageEnd?.scrollIntoView({ behavior: 'auto' })
  }

  function handlePopupState (isOpen: boolean) {
    setPreviewImageOpen(isOpen)
  }

  function handleImagePreview (action: string, src: string) {
    switch (action) {
      case GroupActionEnum.OPEN:
        setImgSrc(src)
        handlePopupState(true)
        break
      case GroupActionEnum.CLOSE:
        handlePopupState(false)
        break
      default:
        throw new Error('handleImagePreview failed')
    }
  }

  function openCallPage () {

  }

  function markMessageSeen () {
    dispatch(markMessageAsSeen({
      groupUrl
    }))
  }

  function handleScroll (event: any) {
    if (event.target.scrollTop === 0) {
      if (!allMessagesFetched) {
        setLoadingOldMessages(true)
        dispatch(fetchGroupMessages({
          messageId
        }))
      }
    } else {
      setLoadingOldMessages(false)
    }
  }

  return (
    <>
      {
        wsUserGroups.length === 0 ?
          <div style={{
            display: 'flex',
            flex: '1',
            flexDirection: 'column',
            maxWidth: '45%'
          }}>
            <NoDataComponent/>
          </div>
          :
          <div style={{
            display: 'flex',
            flex: '1',
            flexDirection: 'column',
            maxWidth: '45%'
          }}>
            <div style={{
              width: '100%',
              height: '50px',
              borderBottom: '1px solid gray'
            }}>
              <Box m={1}>
                                <span style={{
                                  fontSize: '20px',
                                  fontWeight: 'bold'
                                }}>{currentGroupName}</span>
              </Box>
            </div>
            <div
              onScroll={(event) => handleScroll(event)}
              style={{
                backgroundColor: 'transparent',
                width: '100%',
                height: 'calc(100% - 56px)',
                overflowY: 'scroll'
              }}>
              {
                !allMessagesFetched && loadingOldMessages &&
                  <div style={{
                    width: 'inherit',
                    boxSizing: 'border-box',
                    height: '40px',
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'center'
                          }}>
                              <CircularProgress style={{ margin: '5px' }} size={15}/>
                          </div>
                          <span style={{ fontSize: '10px' }}>Loading older messages ....</span>
                      </div>
                  </div>
              }
              <ImagePreviewComponent imgSrc={imgSrc}
                                     displayImagePreview={isPreviewImageOpen}
                                     setDisplayImagePreview={handlePopupState}/>
              {chatHistory && chatHistory.map((val, index, array) => (
                <Tooltip
                  key={index}
                  enterDelay={1000}
                  leaveDelay={0}
                  title={new Date(val.time).getHours() + ':' + new Date(val.time).getMinutes()}
                  placement="left">
                  <div className={'msg ' + styleSelectedMessage()} key={index}
                       style={{ display: 'flex' }}>
                    {index >= 1 && array[index - 1].userId === array[index].userId
                      ? <div style={{
                        minWidth: '40px',
                        width: '40px',
                        height: '40px'
                      }}/>
                      : <div style={{
                        fontFamily: 'Segoe UI,SegoeUI,"Helvetica Neue",Helvetica,Arial,sans-serif',
                        backgroundColor: `${val.color}`,
                        letterSpacing: '1px',
                        minWidth: '40px',
                        width: '40px',
                        height: '40px',
                        textAlign: 'center',
                        fontSize: '20px',
                        borderRadius: ' 50%',
                        border: '1px solid gray',
                        lineHeight: '37px'
                      }}>
                        <div style={{ color: '#FFFFFF' }}>{val.initials}</div>
                      </div>
                    }
                    <div style={{ margin: '4px' }}>
                      {index >= 1 && array[index - 1].userId === array[index].userId
                        ? <div/>
                        : <div>
                          <b>{val.sender} </b>
                        </div>
                      }
                      {
                        val.type === TypeMessageEnum.TEXT
                          ? <div style={{ overflowWrap: 'break-word' }}>
                            {val.message}
                          </div>
                          : <div>
                            {generateImageRender(val)}
                          </div>
                      }
                    </div>
                  </div>
                </Tooltip>
              ))}
              <div style={{
                float: 'left',
                clear: 'both'
              }}
                   ref={(el) => {
                     messageEnd = el
                   }}>
              </div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                boxSizing: 'border-box',
                borderBottom: '0.5px solid #C8C8C8'
              }}>
                {
                  imagePreviewUrl &&
                    <div style={{
                      padding: '10px',
                      height: '120px',
                      maxWidth: '120px',
                      background: 'url(\'' + imagePreviewUrl + '\')',
                      backgroundSize: 'cover',
                      position: 'relative',
                      borderRadius: '10%'
                    }}>
                        <IconButton style={{
                          height: '20px',
                          position: 'absolute',
                          right: '8px',
                          top: '8px',
                          width: '20px'
                        }}
                                    onClick={event => resetImageBuffer(event)}>
                            <HighlightOffIcon/>
                        </IconButton>
                    </div>
                }
              </div>
              <div style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                position: 'relative',
                bottom: '0',
                padding: '5px'
              }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  multiple
                  type="file"
                  onChange={event => previewFile(event)}
                />
                <CallWindowComponent/>
                <label htmlFor="raised-button-file">
                  <Button variant="text" component="span">
                    <ImageIcon/>
                  </Button>
                </label>
                <CustomTextField
                  id={'inputChatMessenger'}
                  label={'Write a message'}
                  value={message}
                  onClick={markMessageSeen}
                  handleChange={(event: any) => handleChange(event)}
                  type={'text'}
                  keyUp={submitMessage}
                  isMultiline={true}
                  isDarkModeEnable={theme}
                  name={'mainWriteMessage'}/>
                <Button
                  onClick={sendMessage}
                  variant="contained"
                  color="primary"
                  style={{
                    marginLeft: '3px',
                    maxWidth: '20px'
                  }}
                  disabled={!imageLoaded && message === ''}
                >
                  <DoubleArrowIcon/>
                </Button>
              </div>
            </div>
          </div>
      }
    </>
  )
}
