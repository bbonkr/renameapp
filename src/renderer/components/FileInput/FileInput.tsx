import React, { FunctionComponent } from 'react';
import { Button } from '@material-ui/core';

interface FileInputProps {
    handleClick: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => void;
}

export const FileInput = ({ handleClick }: FileInputProps) => {
    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClick}>
                Open files
            </Button>
        </div>
    );
};
