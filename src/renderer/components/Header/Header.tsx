import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import './Header.css';

interface HeaderProps {
    title: string;
}

export const Header = ({ title }: HeaderProps) => {
    return (
        <AppBar position="sticky">
            <Toolbar>
                <IconButton edge="start" color="inherit" arai-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6">{title}</Typography>
            </Toolbar>
        </AppBar>
    );
};
