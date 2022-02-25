import React from 'react';
import { Button } from '@material-ui/core';

interface FileInputProps {
    onClick: () => void;
}

export const FileInput = ({ onClick }: FileInputProps) => {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClick}
                disabled={!onClick}
            >
                Open files
            </Button>
        </div>
    );
};
