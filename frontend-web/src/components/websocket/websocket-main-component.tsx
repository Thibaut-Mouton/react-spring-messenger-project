import './websocketStyle.css';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { WebSocketChatComponent } from './websocket-chat-component';
import { WebSocketGroupActionComponent } from './websocket-group-actions-component';
import { WebsocketGroupsComponent } from './websocket-groups-component';
import { useAuthContext } from '../../context/auth-context';
import { useThemeContext } from '../../context/theme-context';
import { generateColorMode } from '../../design/style/enable-dark-mode';

export const WebSocketMainComponent: React.FunctionComponent = () => {
    const { theme } = useThemeContext();
    const { user } = useAuthContext();
    const history = useHistory();

    useEffect(() => {
        document.title = 'Messages | FLM';
    }, []);

    useEffect(() => {
        if (!user) {
            history.push('/');
        }
    }, []);

    return (
        <div className={ generateColorMode(theme) }
            style={ {
                height: 'calc(100% - 64px)',
                display: 'flex',
                justifyContent: 'space-between'
            } }>
            <WebsocketGroupsComponent/>
            <WebSocketChatComponent/>
            <WebSocketGroupActionComponent/>
        </div>
    );
};
