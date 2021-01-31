import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { FileInput } from '../FileInput';
import { FileList } from '../FileList';
// import { FileInfo } from '../../../lib/FileInfo'
import { types } from '../../../models/replaceType';
import {
    Box,
    Grid,
    AppBar,
    Toolbar,
    Paper,
    Button,
    ButtonGroup,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
    Container,
    CssBaseline,
    Fab,
    IconButton,
    Popper,
    Grow,
    ClickAwayListener,
    TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { Channels } from '../../../models/channels';
import { SnackbarOrigin } from '@material-ui/core/Snackbar';
import { useStyles } from './style';
import { FileInfoModel } from '../../../models';

type RenameAppProps = WithSnackbarProps;

const RenameAppInternal = ({ enqueueSnackbar }: RenameAppProps) => {
    const classes = useStyles();

    const [files, setFiles] = useState<FileInfoModel[]>([]);
    const [renamedFiles, setRenamedFiles] = useState<FileInfoModel[]>([]);
    const [type, setType] = useState('1');
    const [append, setAppend] = useState('');
    const [lookup, setLookup] = useState('');
    const [replace, setReplace] = useState('');
    const [lookupRegExp, setLookupRegExp] = useState('');
    const [replaceRegExp, setReplaceRegExp] = useState('');
    const [enablePreviewButton, setEnablePreviewButton] = useState(false);
    const [enabledRenameButton, setEnabledRenameButton] = useState(false);
    const [openFabButtons, setOpenFabButtons] = useState(false);

    const fabButtonAnchorRef = useRef<HTMLDivElement>(null);

    const notistackAnchorOptions: SnackbarOrigin = {
        vertical: 'top',
        horizontal: 'right',
    };
    const getNewKey = () => {
        const date = new Date();
        return date.getUTCMilliseconds().toString();
    };

    useEffect(() => {
        const getSelectedFiles = (
            ev: IpcRendererEvent,
            args: FileInfoModel[],
        ) => {
            setFiles(args);
            setRenamedFiles([]);
            if (args && args.length > 0) {
                enqueueSnackbar('Files opened.', {
                    key: getNewKey(),
                    variant: 'info',
                    anchorOrigin: notistackAnchorOptions,
                });
            }

            // 앱 버튼 닫기
            setOpenFabButtons(false);
        };

        const getSelectedFilesAndAppend = (
            ev: IpcRendererEvent,
            args: FileInfoModel[],
        ) => {
            setFiles(prevFiles => {
                args.forEach(x => {
                    const found = prevFiles.find(
                        f => x.fullPath === f.fullPath,
                    );
                    if (!found) {
                        prevFiles.push(x);
                    }
                });

                return prevFiles.sort(
                    (a: FileInfoModel, b: FileInfoModel): number => {
                        return a.fullPath > b.fullPath ? 1 : -1;
                    },
                );
            });

            setRenamedFiles([]);

            if (args && args.length > 0) {
                enqueueSnackbar('Files opened.', {
                    key: getNewKey(),
                    variant: 'info',
                    anchorOrigin: notistackAnchorOptions,
                });
            }

            // 앱 버튼 닫기
            setOpenFabButtons(false);
        };

        const renameFilesCallback = (
            ev: IpcRendererEvent,
            args: FileInfoModel[],
        ) => {
            setFiles(args);
            setRenamedFiles([]);
            setAppend('');
            setLookup('');
            setReplace('');
            setLookupRegExp('');
            setReplaceRegExp('');
            setEnablePreviewButton(false);
            setEnabledRenameButton(false);

            enqueueSnackbar('Renamed!', {
                key: getNewKey(),
                variant: 'success',
                anchorOrigin: notistackAnchorOptions,
            });
        };

        ipcRenderer.on(Channels.REANME_FILES_CALLBACK, renameFilesCallback);

        ipcRenderer.on(Channels.GET_SELECTED_FILES, getSelectedFiles);

        ipcRenderer.on(
            Channels.GET_SELECTED_FILES_APPEND,
            getSelectedFilesAndAppend,
        );

        return () => {
            ipcRenderer.off(Channels.GET_SELECTED_FILES, getSelectedFiles);
            ipcRenderer.off(
                Channels.REANME_FILES_CALLBACK,
                renameFilesCallback,
            );
            ipcRenderer.off(
                Channels.GET_SELECTED_FILES_APPEND,
                getSelectedFilesAndAppend,
            );
        };
    }, []);

    useEffect(() => {
        const getPreviewButtonEnabled = () => {
            if (!files || files.length < 1) {
                return false;
            }

            if (type === '1') {
                if (lookup && lookup.length > 0) {
                    return true;
                }
            }

            if (type === '2') {
                if (append && append.length > 0) {
                    return true;
                }
            }

            if (type === '3') {
                if (append && append.length > 0) {
                    return true;
                }
            }

            if (type === '4') {
                if (lookupRegExp && lookupRegExp.length > 0) {
                    return true;
                }
            }

            return false;
        };
        const previewButtonEanbeld = getPreviewButtonEnabled();

        setEnablePreviewButton(previewButtonEanbeld);
    }, [files, type, lookup, append, lookupRegExp]);

    useEffect(() => {
        if (!enablePreviewButton) {
            setEnabledRenameButton(false);
        }
    }, [enablePreviewButton]);

    useEffect(() => {
        if (!renamedFiles || renamedFiles.length === 0) {
            setEnabledRenameButton(false);
        }
    }, [renamedFiles]);

    const onOpenFileClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
            ipcRenderer.send(Channels.OPEN_FILE_DIALOG, [
                Channels.GET_SELECTED_FILES,
            ]);
        },
        [],
    );

    const onOpenFileAndAppendClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
            ipcRenderer.send(Channels.OPEN_FILE_DIALOG, [
                Channels.GET_SELECTED_FILES_APPEND,
            ]);
        },
        [],
    );

    const onTypeChanged = useCallback(
        event => {
            const selectedValue = event.target.value;
            if (type !== selectedValue) {
                setType(selectedValue);
                setAppend('');
                setLookup('');
                setReplace('');
                setLookupRegExp('');
                setReplaceRegExp('');
                setEnablePreviewButton(false);
                setEnabledRenameButton(false);
            }
        },
        [files, type, lookup, append, lookupRegExp],
    );

    const onAppendChanged = useCallback(event => {
        const changedValue = event.target.value;
        setAppend(changedValue);
    }, []);

    const onLookupChanged = useCallback(event => {
        const changedValue = event.target.value;
        setLookup(changedValue);
    }, []);

    const onReplaceChanged = useCallback(event => {
        const changedValue = event.target.value;
        setReplace(changedValue);
    }, []);

    const onLookupRegExpChanged = useCallback(event => {
        const changedValue = event.target.value;
        setLookupRegExp(changedValue);
    }, []);

    const onReplaceRegExpChanged = useCallback(event => {
        const changedValue = event.target.value;
        setReplaceRegExp(changedValue);
    }, []);

    const onRenameClick = useCallback(
        event => {
            if (renamedFiles) {
                ipcRenderer.send(Channels.RENAME_FILES, renamedFiles);
                setEnabledRenameButton(false);
            }
        },
        [renamedFiles],
    );

    const applyRename = useCallback(() => {
        const candidateFiles: FileInfoModel[] = files.map((v, i) => {
            let name = '';

            if (type === '1') {
                name = v.name.replace(lookup, replace);
            }
            if (type === '2') {
                name = `${append}${v.name}`;
            }
            if (type === '3') {
                name = `${v.name}${append}`;
            }
            if (type === '4') {
                // 정규식
                const regExp = new RegExp(lookupRegExp, 'gi');
                name = v.name.replace(regExp, replaceRegExp);
            }

            // return obj;
            return {
                ...v,
                name: name,
                error: null,
                renamed: false,
            };
        });

        setRenamedFiles(candidateFiles);
    }, [files, type, lookup, replace, append, lookupRegExp, replaceRegExp]);

    const onPreviewClick = useCallback(
        event => {
            applyRename();

            setEnabledRenameButton(true);
        },
        [files, type, lookup, replace, append, lookupRegExp, replaceRegExp],
    );

    const handleOpen = useCallback(() => {
        setOpenFabButtons(prevOpen => !prevOpen);
    }, []);

    const handleClose = useCallback(event => {
        if (
            fabButtonAnchorRef.current &&
            fabButtonAnchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpenFabButtons(false);
    }, []);

    const handleRemoveFile = useCallback(
        (file: FileInfoModel) => (
            event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        ): void => {
            setFiles(prevFiles => {
                return prevFiles.filter(f => f.fullPath !== file.fullPath);
            });

            setRenamedFiles([]);
        },
        [files],
    );

    return (
        <>
            <CssBaseline />
            <Container maxWidth={false} className={classes.root}>
                <AppBar position="sticky">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            arai-label="menu"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Rename App
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box className={classes.contentWrapper}>
                    <Paper className={classes.fileInput}>
                        <FileInput handleClick={onOpenFileClick} />
                    </Paper>

                    <Paper className={classes.contentContainer}>
                        <form
                            className={classes.formContainer}
                            noValidate={true}
                            autoComplete="off"
                        >
                            <FormControl className={classes.formControl}>
                                <InputLabel id="selectOperationType">
                                    Type
                                </InputLabel>
                                <Select
                                    labelId="selectOperationType"
                                    id="demo-simple-select"
                                    value={type}
                                    onChange={onTypeChanged}
                                    margin="none"
                                >
                                    {types.map((v, i) => {
                                        return (
                                            <MenuItem key={v.key} value={v.key}>
                                                {v.value}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>

                            <Box
                                display="flex"
                                flexDirection="row"
                                alignItems="baseline"
                                justifyContent="stretch"
                                style={{ flex: 1 }}
                            >
                                {type === '2' || type === '3' ? (
                                    <FormControl
                                        className={classes.formControl}
                                        style={{ flex: 1 }}
                                    >
                                        {/* <InputLabel htmlFor="append-text-input">
                                            추가할 문자열
                                        </InputLabel>
                                        <Input
                                            id="append-text-input"
                                            value={append}
                                            onChange={onAppendChanged}
                                            className={classes.textField}
                                            margin="none"
                                        /> */}
                                        <TextField
                                            label="추가할 문자열"
                                            id="append-text-input"
                                            value={append}
                                            onChange={onAppendChanged}
                                            className={classes.textField}
                                            margin="none"
                                            fullWidth
                                            helperText={`입력된 문자열이 ${
                                                type === '2' ? '앞' : '뒷'
                                            }에 추가됩니다.`}
                                        />
                                    </FormControl>
                                ) : null}

                                {type === '1' ? (
                                    <>
                                        <FormControl
                                            className={classes.formControl}
                                            style={{ flex: 1 }}
                                        >
                                            {/* <InputLabel htmlFor="lookup-text-input">
                                                찾는 문자열
                                            </InputLabel>
                                            <Input
                                                id="lookup-text-input"
                                                value={lookup}
                                                onChange={onLookupChanged}
                                                className={classes.textField}
                                                placeholder="찾는 문자열"
                                                margin="none"
                                            /> */}
                                            <TextField
                                                label="찾는 문자열"
                                                id="lookup-text-input"
                                                value={lookup}
                                                onChange={onLookupChanged}
                                                className={classes.textField}
                                                placeholder="찾는 문자열"
                                                margin="none"
                                                fullWidth
                                                helperText="변경하기 위해 찾을 문자열"
                                            />
                                        </FormControl>
                                        <FormControl
                                            className={classes.formControl}
                                            style={{ flex: 1 }}
                                        >
                                            {/* <InputLabel htmlFor="replace-text-input">
                                                변경할 문자열
                                            </InputLabel>
                                            <Input
                                                id="replace-text-input"
                                                value={replace}
                                                onChange={onReplaceChanged}
                                                className={classes.textField}
                                                placeholder="변경할 문자열"
                                                aria-describedby="replace-text-input-helper"
                                                margin="none"
                                            />

                                            <FormHelperText id="replace-text-input-helper">
                                                첫번째 발견된 문자열만
                                                변경됩니다.
                                            </FormHelperText> */}

                                            <TextField
                                                label="변경할 문자열"
                                                id="replace-text-input"
                                                value={replace}
                                                onChange={onReplaceChanged}
                                                className={classes.textField}
                                                placeholder="변경할 문자열"
                                                aria-describedby="replace-text-input-helper"
                                                margin="none"
                                                helperText="첫번째 발견된 문자열만 변경됩니다."
                                                fullWidth
                                            />
                                        </FormControl>
                                    </>
                                ) : null}
                                {type === '4' ? (
                                    <>
                                        <FormControl
                                            className={classes.formControl}
                                            style={{ flex: 1 }}
                                        >
                                            {/* <InputLabel htmlFor="lookup-regexp-input-text">
                                                찾는 정규식
                                            </InputLabel>
                                            <Input
                                                id="lookup-regexp-input-text"
                                                value={lookupRegExp}
                                                onChange={onLookupRegExpChanged}
                                                className={classes.textField}
                                                margin="none"
                                                placeholder="정규식"
                                                aria-describedby="lookup-regexp-input-help-text"
                                                startAdornment={<span>/</span>}
                                                endAdornment={<span>/gi</span>}
                                            />
                                            <FormHelperText id="lookup-regexp-input-help-text">
                                                발견된 모든 문자열이 변경됩니다.
                                            </FormHelperText> */}

                                            <TextField
                                                label="찾는 정규식"
                                                id="lookup-regexp-input-text"
                                                value={lookupRegExp}
                                                onChange={onLookupRegExpChanged}
                                                className={classes.textField}
                                                margin="none"
                                                placeholder="정규식"
                                                aria-describedby="lookup-regexp-input-help-text"
                                                InputProps={{
                                                    startAdornment: (
                                                        <span>/</span>
                                                    ),
                                                    endAdornment: (
                                                        <span>/gi</span>
                                                    ),
                                                }}
                                                helperText="발견된 모든 문자열이 변경됩니다."
                                                fullWidth
                                            />
                                        </FormControl>
                                        <FormControl
                                            className={classes.formControl}
                                            style={{ flex: 1 }}
                                        >
                                            {/* <InputLabel htmlFor="replace-reg-exp-text-input">
                                                변경할 문자열
                                            </InputLabel>
                                            <Input
                                                id="replace-reg-exp-text-input"
                                                value={replaceRegExp}
                                                onChange={
                                                    onReplaceRegExpChanged
                                                }
                                                margin="none"
                                                className={classes.textField}
                                            /> */}
                                            <TextField
                                                label="변경할 문자열"
                                                id="replace-reg-exp-text-input"
                                                value={replaceRegExp}
                                                onChange={
                                                    onReplaceRegExpChanged
                                                }
                                                margin="none"
                                                className={classes.textField}
                                                fullWidth
                                                helperText=""
                                            />
                                        </FormControl>
                                    </>
                                ) : null}
                            </Box>
                        </form>
                    </Paper>
                    <Paper className={classes.fileInput}>
                        <ButtonGroup color="primary" variant="contained">
                            <Button
                                disabled={!enablePreviewButton}
                                onClick={onPreviewClick}
                            >
                                Preview
                            </Button>

                            <Button
                                disabled={!enabledRenameButton}
                                onClick={onRenameClick}
                            >
                                Rename
                            </Button>
                        </ButtonGroup>
                    </Paper>

                    <Box className={classes.contentContainer}>
                        <Grid container spacing={2} component="div">
                            <Grid item xs={6} component="div">
                                <Paper className={classes.contentWrapper}>
                                    <Typography variant="h6" component="h3">
                                        Before
                                    </Typography>
                                </Paper>
                                <FileList
                                    files={files}
                                    showRemoveButton={true}
                                    handleRemoveFile={handleRemoveFile}
                                />
                            </Grid>
                            <Grid item={true} xs={6} component="div">
                                <React.Fragment>
                                    <Paper className={classes.contentWrapper}>
                                        <Typography variant="h6" component="h3">
                                            After
                                        </Typography>
                                    </Paper>

                                    <FileList files={renamedFiles} />
                                </React.Fragment>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <div
                    ref={fabButtonAnchorRef}
                    className={classes.appButtonOpenFiles}
                >
                    <Fab
                        color={openFabButtons ? 'default' : 'secondary'}
                        size="medium"
                        aria-label="add file"
                        onClick={handleOpen}
                    >
                        {openFabButtons ? <CloseIcon /> : <AddIcon />}
                    </Fab>
                </div>
                <Popper
                    open={openFabButtons}
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
                                <div>
                                    <div>
                                        <Typography component="span">
                                            파일 열기
                                        </Typography>
                                        <Fab
                                            color="primary"
                                            size="medium"
                                            aria-label="add file"
                                            title="파일 목록을 초기화하고 파일을 추가합니다."
                                            onClick={onOpenFileClick}
                                        >
                                            <AddIcon />
                                        </Fab>
                                    </div>

                                    <div>
                                        <Typography component="span">
                                            파일 추가
                                        </Typography>

                                        <Fab
                                            color="secondary"
                                            size="medium"
                                            aria-label="append file"
                                            title="파일을 현재 목록에 추가합니다."
                                            onClick={onOpenFileAndAppendClick}
                                        >
                                            <AddIcon />
                                        </Fab>
                                    </div>
                                </div>
                            </ClickAwayListener>
                        </Grow>
                    )}
                </Popper>
            </Container>
        </>
    );
};

export const RenameApp = withSnackbar(RenameAppInternal);
