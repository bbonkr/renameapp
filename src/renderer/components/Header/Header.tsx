import React from 'react';
import { ipcRenderer } from 'electron';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import SquareIcon from '@material-ui/icons/CropSquare';
import BarIcon from '@material-ui/icons/Remove';

import './Header.css';
import { Channels } from '../../../models/channels';

interface HeaderProps {
    title: string;
}

export const Header = ({ title }: HeaderProps) => {
    const handleClickClose = () => {
        ipcRenderer.send(Channels.WINDOW_CLOSE);
    };

    const handleClickMinimize = () => {
        ipcRenderer.send(Channels.WINDOW_MINIMIZE);
    };

    const handleClickMaximize = () => {
        ipcRenderer.send(Channels.WINDOW_MAXIMIZE);
    };

    return (
        <AppBar className="app-header" position="sticky">
            <MenuIcon />
            <Typography variant="body2">{title}</Typography>
            <div>
                <Button
                    size="small"
                    color="default"
                    onClick={handleClickMinimize}
                >
                    <BarIcon fontSize="small" />
                </Button>
                <Button
                    size="small"
                    color="default"
                    onClick={handleClickMaximize}
                >
                    <SquareIcon fontSize="small" />
                </Button>
                <Button
                    size="small"
                    color="secondary"
                    onClick={handleClickClose}
                >
                    <CloseIcon fontSize="small" />
                </Button>
            </div>
            {/* <Toolbar>
                <IconButton edge="start" color="inherit" arai-label="menu">
                    <MenuIcon />
                </IconButton>
            </Toolbar> */}
        </AppBar>
    );
};
