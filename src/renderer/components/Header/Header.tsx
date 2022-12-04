import React from 'react';
// import { ipcRenderer } from 'electron';
import {
    AppBar,
    // Toolbar,
    Typography,
    // IconButton,
    Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SquareIcon from '@mui/icons-material/CropSquare';
import BarIcon from '@mui/icons-material/Remove';

import './Header.css';
import { Channels } from '../../../models/channels';

interface HeaderProps {
    title: string;
}

export const Header = ({ title }: HeaderProps) => {
    const ipcRenderer = window.electron.ipcRenderer;

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
        <AppBar id="header" className="app-header" position="sticky">
            <MenuIcon />
            <Typography variant="body2">{title}</Typography>
            <div>
                <Button
                    size="small"
                    color="secondary"
                    onClick={handleClickMinimize}
                >
                    <BarIcon fontSize="small" />
                </Button>
                <Button
                    size="small"
                    color="secondary"
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
