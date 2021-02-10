import React from 'react';
import { Fab } from '@material-ui/core';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import './GoToTop.css';

export const GoToTop = () => {
    const handleClickGoToTop = () => {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    };
    return (
        <div className={'app-button-go-to-top'}>
            <Fab
                color={'default'}
                size="medium"
                aria-label="add file"
                title="add file"
                onClick={handleClickGoToTop}
            >
                <ArrowUpward />
            </Fab>
        </div>
    );
};
