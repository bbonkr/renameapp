import React, { useRef } from 'react';
import {
    Typography,
    Fab,
    Popper,
    Grow,
    ClickAwayListener,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

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
    const fabButtonAnchorRef = useRef<HTMLDivElement>(null);
    // const [openFabButtons, setOpenFabButtons] = useState(false);

    const handleOpen = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        // setOpenFabButtons(prevOpen => !prevOpen);
        if (onOpen) {
            onOpen();
        }
    };

    const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
        if (
            fabButtonAnchorRef.current &&
            fabButtonAnchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        if (onClose) {
            onClose();
        }
    };

    const handleClickOpenFile = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        if (onOpenFileClick) {
            onOpenFileClick();
        }
    };

    const handleOpenFileAndAppend = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        if (onOpenFileAndAppendClick) {
            onOpenFileAndAppendClick();
        }
    };

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
                anchorEl={fabButtonAnchorRef.current}
                transition={true}
                disablePortal={true}
                placement="bottom-end"
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom'
                                    ? 'center top'
                                    : 'center bottom',
                        }}
                    >
                        <ClickAwayListener onClickAway={handleClose}>
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
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    );
};
