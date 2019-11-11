import { ipcRenderer, IpcRendererEvent } from 'electron';
import React, {
    FunctionComponent,
    useState,
    useEffect,
    useCallback,
} from 'react';
import { FileInput } from './FileInput';
import { FileList } from './FileList';
import { FileInfo } from '../FileInfo';
import { types } from '../typings/replaceType';
import {
    Box,
    Grid,
    AppBar,
    Toolbar,
    makeStyles,
    Theme,
    createStyles,
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
    TextField,
    Input,
    FormHelperText,
    Divider,
    Fab,
    IconButton,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { Channels } from '../typings/channels';
import { SnackbarOrigin } from '@material-ui/core/Snackbar';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            padding: 0,
            margin: 0,
        },
        contentWrapper: {
            padding: '0.8rem',
        },
        contentContainer: {
            margin: '0 0.3rem',
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        formContainer: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 200,
        },
        fileInput: {
            padding: '1rem 0.8rem',
            margin: '0.3rem',
        },
        appButtonOpenFiles: {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 1000,
        },
        fileListContainer: {
            minHeight: '100%',
            padding: '1rem 0.8rem',
            margin: '0.3rem',
        },
    })
);

export interface IRenameAppProps extends WithSnackbarProps {}

const RenameAppInternal: FunctionComponent<IRenameAppProps> = ({
    enqueueSnackbar,
}) => {
    const classes = useStyles();

    const [files, setFiles] = useState<FileInfo[]>([]);
    const [renamedFiles, setRenamedFiles] = useState<FileInfo[]>([]);
    const [type, setType] = useState('1');
    const [append, setAppend] = useState('');
    const [lookup, setLookup] = useState('');
    const [replace, setReplace] = useState('');
    const [lookupRegExp, setLookupRegExp] = useState('');
    const [replaceRegExp, setReplaceRegExp] = useState('');
    const [enablePreviewButton, setEnablePreviewButton] = useState(false);
    const [enabledRenameButton, setEnabledRenameButton] = useState(false);
    const notistackAnchorOptions: SnackbarOrigin = {
        vertical: 'top',
        horizontal: 'right',
    };
    const getNewKey = () => {
        const date = new Date();
        return date.getUTCMilliseconds().toString();
    };

    useEffect(() => {
        const getSelectedFiles = (ev: IpcRendererEvent, args: FileInfo[]) => {
            setFiles(args);
            setRenamedFiles([]);
            if (args && args.length > 0) {
                enqueueSnackbar('Files opened.', {
                    key: getNewKey(),
                    variant: 'info',
                    anchorOrigin: notistackAnchorOptions,
                });
            }
        };

        const renameFilesCallback = (
            ev: IpcRendererEvent,
            args: FileInfo[]
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

        ipcRenderer.on(Channels.GET_SELECTED_FIELS, getSelectedFiles);

        return () => {
            ipcRenderer.off(Channels.GET_SELECTED_FIELS, getSelectedFiles);
            ipcRenderer.off(
                Channels.REANME_FILES_CALLBACK,
                renameFilesCallback
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
        [files, type, lookup, append, lookupRegExp]
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

    const onPreviewClick = useCallback(
        event => {
            applyRename();

            setEnabledRenameButton(true);
        },
        [files, type, lookup, replace, append, lookupRegExp, replaceRegExp]
    );

    const onRenameClick = useCallback(
        event => {
            if (renamedFiles) {
                ipcRenderer.send(Channels.RENAME_FILES, renamedFiles);
                setEnabledRenameButton(false);
            }
        },
        [renamedFiles]
    );

    const applyRename = useCallback(() => {
        const candidateFiles = files.map((v, i) => {
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
            return new FileInfo({
                ...v,
                name: name,
                error: null,
                renamed: false,
            });
        });

        setRenamedFiles(candidateFiles);
    }, [files, type, lookup, replace, append, lookupRegExp, replaceRegExp]);

    // const validateCanPreview = useCallback(() => {
    //     const enabled = updatePreviewButtonStatus();

    //     setEnablePreviewButton(enabled);
    // }, [files, type, lookup, append, lookupRegExp]);

    // const updatePreviewButtonStatus = useCallback(() => {
    //     if (!files || files.length < 1) {
    //         return false;
    //     }

    //     if (type === '1') {
    //         if (lookup && lookup.length > 0) {
    //             return true;
    //         }
    //     }

    //     if (type === '2') {
    //         if (append && append.length > 0) {
    //             return true;
    //         }
    //     }

    //     if (type === '3') {
    //         if (append && append.length > 0) {
    //             return true;
    //         }
    //     }

    //     if (type === '4') {
    //         if (lookupRegExp && lookupRegExp.length > 0) {
    //             return true;
    //         }
    //     }

    //     return false;
    // }, [files, type, lookup, append, lookupRegExp]);

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
                        <FileInput />
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

                            {type === '2' || type === '3' ? (
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="append-text-input">
                                        추가할 문자열
                                    </InputLabel>
                                    <Input
                                        id="append-text-input"
                                        value={append}
                                        onChange={onAppendChanged}
                                        className={classes.textField}
                                        margin="none"
                                    />
                                </FormControl>
                            ) : null}

                            {type === '1' ? (
                                <>
                                    <FormControl
                                        className={classes.formControl}
                                    >
                                        <InputLabel htmlFor="lookup-text-input">
                                            찾는 문자열
                                        </InputLabel>
                                        <Input
                                            id="lookup-text-input"
                                            value={lookup}
                                            onChange={onLookupChanged}
                                            className={classes.textField}
                                            placeholder="찾는 문자열"
                                            margin="none"
                                        />
                                    </FormControl>
                                    <FormControl
                                        className={classes.formControl}
                                    >
                                        <InputLabel htmlFor="replace-text-input">
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
                                            첫번째 발견된 문자열만 변경됩니다.
                                        </FormHelperText>
                                    </FormControl>
                                </>
                            ) : null}
                            {type === '4' ? (
                                <>
                                    <FormControl
                                        className={classes.formControl}
                                    >
                                        <InputLabel htmlFor="lookup-regexp-input-text">
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
                                        </FormHelperText>
                                    </FormControl>
                                    <FormControl
                                        className={classes.formControl}
                                    >
                                        <InputLabel htmlFor="replace-reg-exp-text-input">
                                            변경할 문자열
                                        </InputLabel>
                                        <Input
                                            id="replace-reg-exp-text-input"
                                            value={replaceRegExp}
                                            onChange={onReplaceRegExpChanged}
                                            margin="none"
                                            className={classes.textField}
                                        />
                                    </FormControl>
                                </>
                            ) : null}
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

                    <Paper className={classes.contentContainer}>
                        <Grid
                            container={true}
                            spacing={2}
                            className={classes.fileListContainer}
                        >
                            <Grid item={true} xs={6}>
                                <Typography variant="h6" component="h3">
                                    Before
                                </Typography>
                                <FileList files={files} />
                            </Grid>
                            <Grid item={true} xs={6}>
                                <Typography variant="h6" component="h3">
                                    After
                                </Typography>
                                <FileList files={renamedFiles} />
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
                <Fab
                    className={classes.appButtonOpenFiles}
                    color="secondary"
                    size="medium"
                    aria-label="add file"
                >
                    <AddIcon />
                </Fab>
            </Container>
        </>
    );
};

export const RenameApp = withSnackbar(RenameAppInternal);
