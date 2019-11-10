import React, { FunctionComponent, useCallback } from 'react';
import { ipcRenderer } from 'electron';
import { Button } from '@material-ui/core';

export const FileInput: FunctionComponent = () => {
    const onClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
            ipcRenderer.send('openFileDialog');
        },
        []
    );

    return (
        <div>
            <Button variant="contained" color="primary" onClick={onClick}>
                Open files
            </Button>
        </div>
    );
};
