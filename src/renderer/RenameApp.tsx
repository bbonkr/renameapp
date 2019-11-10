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
    Grid,
} from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            padding: 0,
            margin: 0,
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

    useEffect(() => {
        const getSelectedFiles = (ev: IpcRendererEvent, args: FileInfo[]) => {
            // console.log('files: ', args);
            setFiles(args);
            setRenamedFiles([]);

            enqueueSnackbar('Files opened.');
        };

        const renameFilesCallback = (
            ev: IpcRendererEvent,
            args: FileInfo[]
        ) => {
            // let renamedResults = args.map((v, i) => {
            //     return {
            //         name: v.name,
            //         extension: v.extension,
            //         directoryName: v.directoryName,
            //         fullPath: v.fullPath,
            //         error: v.error,
            //         hasError: v.hasError,
            //         renamed: v.renamed,
            //     };
            // });

            setFiles(args);
            setRenamedFiles([]);
            setAppend('');
            setLookup('');
            setReplace('');
            setLookupRegExp('');
            setReplaceRegExp('');
            setEnablePreviewButton(false);
            setEnabledRenameButton(false);

            // alert.show('Renamed!');
            enqueueSnackbar('Renamed!');
        };

        ipcRenderer.on('renameFiles-callback', renameFilesCallback);

        ipcRenderer.on('get-selected-file', getSelectedFiles);

        return () => {
            ipcRenderer.off('get-selected-file', getSelectedFiles);
            ipcRenderer.off('renameFiles-callback', renameFilesCallback);
        };
    }, []);

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

            validateCanPreview();
        },
        [type]
    );

    const onAppendChanged = useCallback(
        event => {
            const changedValue = event.target.value;
            // console.log(`append: ${append} => ${changedValue}`);
            if (append !== changedValue) {
                setAppend(changedValue);
            }
            validateCanPreview();
        },
        [append]
    );

    const onLookupChanged = useCallback(
        event => {
            const changedValue = event.target.value;
            if (changedValue !== lookup) {
                // this.setState({ lookup: changedValue });
                setLookup(changedValue);
            }

            validateCanPreview();
        },
        [lookup]
    );

    const onReplaceChanged = useCallback(
        event => {
            const changedValue = event.target.value;
            if (replace !== changedValue) {
                setReplace(changedValue);
            }
        },
        [replace]
    );

    const onLookupRegExpChanged = useCallback(
        event => {
            // const { lookupRegExp } = this.state;
            const changedValue = event.target.value;
            if (lookupRegExp !== changedValue) {
                // this.setState({ lookupRegExp: changedValue });
                setLookupRegExp(changedValue);
            }

            validateCanPreview();
        },
        [lookupRegExp]
    );

    const onReplaceRegExpChanged = useCallback(
        event => {
            // const { replaceRegExp } = this.state;
            const changedValue = event.target.value;
            if (replaceRegExp !== changedValue) {
                // this.setState({ replaceRegExp: changedValue });
                setReplaceRegExp(changedValue);
            }
        },
        [replaceRegExp]
    );

    const onPreviewClick = useCallback(
        event => {
            applyRename();

            // this.setState({ enabledRenameButton: true });
            setEnabledRenameButton(true);
        },
        [files, type, lookup, replace, append, lookupRegExp, replaceRegExp]
    );

    const onRenameClick = useCallback(
        event => {
            // const { renamedFiles } = this.state;
            if (renamedFiles) {
                ipcRenderer.send('rename-files', renamedFiles);
                setEnabledRenameButton(false);
            }
        },
        [renamedFiles]
    );

    const applyRename = useCallback(() => {
        const candidateFiles = files.map((v, i) => {
            let name = '';
            // let obj = {
            //     name: v.name,
            //     extension: v.extension,
            //     directoryName: v.directoryName,
            //     fullPath: v.fullPath,
            //     error: null,
            //     hasError: false,
            //     renamed: false,
            // };

            if (type === '1') {
                // console.log('name: ', obj.name, obj.name);
                // console.log('lookup: ', lookup);
                // console.log('replace: ', replace);

                // obj.name = obj.name.replace(lookup, replace);
                name = v.name.replace(lookup, replace);
            }
            if (type === '2') {
                // obj.name = `${append}${obj.name}`;
                name = `${append}${v.name}`;
            }
            if (type === '3') {
                // obj.name = `${obj.name}${append}`;
                name = `${v.name}${append}`;
            }
            if (type === '4') {
                // 정규식
                const regExp = new RegExp(lookupRegExp, 'gi');
                // obj.name = obj.name.replace(regExp, replaceRegExp);
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

    const validateCanPreview = useCallback(() => {
        const enabled = updatePreviewButtonStatus();
        setEnablePreviewButton(updatePreviewButtonStatus());
    }, [files, type, lookup, append, lookupRegExp]);

    const updatePreviewButtonStatus = useCallback(() => {
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
    }, [files, type, lookup, append, lookupRegExp]);

    return (
        <>
            <CssBaseline />
            <Container maxWidth={false} className={classes.root}>
                <AppBar position="sticky">
                    <Toolbar>
                        {/* <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            arai-label="menu"
                        >
                            <MenuIcon />
                        </IconButton> */}
                        <Typography variant="h6" className={classes.title}>
                            Rename App
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Paper className={classes.fileInput}>
                    <FileInput />
                </Paper>

                <Paper>
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
                            // <div>
                            //     <TextField
                            //         value={append}
                            //         onChange={onAppendChanged}
                            //         label="추가할 문자열"
                            //         margin="normal"
                            //         className={classes.textField}
                            //     />
                            // </div>
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
                                <FormControl className={classes.formControl}>
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
                                <FormControl className={classes.formControl}>
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
                                <FormControl className={classes.formControl}>
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
                                <FormControl className={classes.formControl}>
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
                <Divider variant="fullWidth" orientation="horizontal" />
                <Grid container={true} spacing={2}>
                    <Grid item={true} xs={6}>
                        <Paper>
                            <Typography variant="h6" component="h3">
                                Before
                            </Typography>
                            <FileList files={files} />
                        </Paper>
                    </Grid>
                    <Grid item={true} xs={6}>
                        <Paper>
                            <Typography variant="h6" component="h3">
                                After
                            </Typography>
                            <FileList files={renamedFiles} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export const RenameApp = withSnackbar(RenameAppInternal);
