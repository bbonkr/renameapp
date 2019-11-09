import React, { FunctionComponent } from 'react';
import { ipcRenderer } from 'electron';

export const FileInput: FunctionComponent = () => {
    const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        ipcRenderer.send('openFileDialog');
    };
    return <button onClick={onClick}>Open files</button>;
};
