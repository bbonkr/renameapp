import React, { FunctionComponent } from 'react';
import { Button } from '@material-ui/core';

export interface IFileInput {
    handleClick: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
}

export const FileInput: FunctionComponent<IFileInput> = ({ handleClick }) => {
    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClick}>
                Open files
            </Button>
        </div>
    );
};
