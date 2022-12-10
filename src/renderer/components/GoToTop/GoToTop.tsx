import React from 'react';
import { Fab } from '@mui/material';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import './GoToTop.css';

export const GoToTop = () => {
    const handleClickGoToTop = () => {
        // const containerElement = window.document.querySelector<HTMLDivElement>(
        //     '.content-wrapper ',
        // );
        // if (containerElement) {
        //     containerElement.scrollTo({
        //         left: 0,
        //         top: 0,
        //         behavior: 'smooth',
        //     });
        // }

        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth',
        });
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
