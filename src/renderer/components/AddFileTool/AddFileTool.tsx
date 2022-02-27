import React, { useEffect, useRef } from 'react';
import { Typography, Fab, Popper, ClickAwayListener, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import './AddFileTool.css';

interface AddFileToolProps {
    /**
     * 확장 여부
     */
    isOpened?: boolean;
    onOpenFileClick?: () => void;
    onOpenFileAndAppendClick?: () => void;
    onOpen?: () => void;
    onClose?: () => void;
}

export const AddFileTool = ({
    isOpened,
    onOpenFileClick,
    onOpenFileAndAppendClick,
    onOpen,
    onClose,
}: AddFileToolProps) => {
    const [anchorRef, setAnchorRef] = React.useState<HTMLDivElement | null>(
        null,
    );
    const fabButtonAnchorRef = useRef<HTMLDivElement>(null);

    const handleOpen = () => {
        if (onOpen) {
            onOpen();
        }
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    const handleClickOpenFile = () => {
        if (onOpenFileClick) {
            onOpenFileClick();
        }
    };

    const handleOpenFileAndAppend = () => {
        if (onOpenFileAndAppendClick) {
            onOpenFileAndAppendClick();
        }
    };

    useEffect(() => {
        if (fabButtonAnchorRef.current) {
            setAnchorRef(_ => fabButtonAnchorRef.current);
        }
    }, []);

    return (
        <React.Fragment>
            <div ref={fabButtonAnchorRef} className={'app-button-open-files'}>
                <Fab
                    color={isOpened ? 'default' : 'secondary'}
                    size="medium"
                    aria-label="add file"
                    title="add file"
                    onClick={handleOpen}
                >
                    {isOpened ? <CloseIcon /> : <AddIcon />}
                </Fab>
            </div>
            <Popper
                open={isOpened ?? false}
                unselectable="on"
                anchorEl={anchorRef}
                // transition={true}
                disablePortal={true}
                placement="bottom-end"
            >
                {({ TransitionProps, placement }) => (
                    <Box
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom'
                                    ? 'center top'
                                    : 'center bottom',
                        }}
                    >
                        <ClickAwayListener
                            onClickAway={handleClose}
                            mouseEvent="onClick"
                            touchEvent="onTouchEnd"
                        >
                            <div className="tool-item">
                                <div>
                                    <Typography component="span">
                                        파일 열기
                                    </Typography>
                                    <Fab
                                        color="primary"
                                        size="medium"
                                        aria-label="add file"
                                        title="파일 목록을 초기화하고 파일을 추가합니다."
                                        onClick={handleClickOpenFile}
                                    >
                                        <AddIcon />
                                    </Fab>
                                </div>

                                <div className="tool-item">
                                    <Typography component="span">
                                        파일 추가
                                    </Typography>

                                    <Fab
                                        color="secondary"
                                        size="medium"
                                        aria-label="append file"
                                        title="파일을 현재 목록에 추가합니다."
                                        onClick={handleOpenFileAndAppend}
                                    >
                                        <AddIcon />
                                    </Fab>
                                </div>
                            </div>
                        </ClickAwayListener>
                    </Box>
                )}
            </Popper>
        </React.Fragment>
    );
};
