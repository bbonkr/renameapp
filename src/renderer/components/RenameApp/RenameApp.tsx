import React, { useState, useEffect } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { FileInput } from '../FileInput';
import { FileList } from '../FileList';
import {
    Box,
    Grid,
    Paper,
    Button,
    ButtonGroup,
    Typography,
    Container,
    CssBaseline,
} from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { Channels } from '../../../models/channels';
import { SnackbarOrigin } from '@material-ui/core/Snackbar';
import { useStyles } from './style';
import { FileInfoModel } from '../../../models';
import { AddFileTool } from '../AddFileTool';
import { Header } from '../Header';
import { RenameTool, FormData } from '../RenameTool';
import { GoToTop } from '../GoToTop';

type RenameAppProps = WithSnackbarProps;

const RenameAppInternal = ({ enqueueSnackbar }: RenameAppProps) => {
    const classes = useStyles();

    const [files, setFiles] = useState<FileInfoModel[]>([]);
    const [renamedFiles, setRenamedFiles] = useState<FileInfoModel[]>([]);
    const [type, setType] = useState('1');
    const [replaceLookup, setReplaceLookup] = useState('');
    const [replaceValue, setReplaceValue] = useState('');
    const [enablePreviewButton, setEnablePreviewButton] = useState(false);
    const [enabledRenameButton, setEnabledRenameButton] = useState(false);
    const [openAddFileTool, setOpenAddFileTool] = useState(false);

    const notistackAnchorOptions: SnackbarOrigin = {
        vertical: 'top',
        horizontal: 'right',
    };
    const getNewKey = () => {
        const date = new Date();
        return date.getUTCMilliseconds().toString();
    };

    const handleChangeFormData = (data: FormData) => {
        setType(_ => data.type);
        setReplaceLookup(_ => data.lookup);

        setReplaceValue(_ => data.value);
        setEnabledRenameButton(_ => false);
    };

    useEffect(() => {
        const getSelectedFiles = (
            _ev: IpcRendererEvent,
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
            setOpenAddFileTool(_ => false);
        };

        const getSelectedFilesAndAppend = (
            _ev: IpcRendererEvent,
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
            setOpenAddFileTool(_ => false);
        };

        const renameFilesCallback = (
            _ev: IpcRendererEvent,
            args: FileInfoModel[],
        ) => {
            setFiles(args);
            setRenamedFiles([]);
            // setAppend('');
            // setLookup('');
            // setReplace('');
            // setLookupRegExp('');
            // setReplaceRegExp('');

            setReplaceLookup('');
            setReplaceValue('');

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
                if (!replaceLookup || replaceLookup.length === 0) {
                    return false;
                }
            }

            if (type === '2' || type === '3') {
                if (replaceValue || replaceValue.length === 0) {
                    return true;
                }
            }

            if (type === '4') {
                if (!replaceLookup || replaceLookup.length === 0) {
                    return false;
                }
                if (!replaceLookup || replaceLookup.length === 0) {
                    return false;
                }
            }

            return true;
        };
        const previewButtonEanbeld = getPreviewButtonEnabled();

        setEnablePreviewButton(previewButtonEanbeld);
    }, [files, type, replaceLookup, replaceValue]);

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

    const onOpenFileClick = () => {
        ipcRenderer.send(Channels.OPEN_FILE_DIALOG, [
            Channels.GET_SELECTED_FILES,
        ]);
    };

    const onOpenFileAndAppendClick = () => {
        ipcRenderer.send(Channels.OPEN_FILE_DIALOG, [
            Channels.GET_SELECTED_FILES_APPEND,
        ]);
    };

    const handleOpenAddFileTool = () => {
        setOpenAddFileTool(_ => true);
    };
    const handleCloseAddFileTool = () => {
        setOpenAddFileTool(_ => false);
    };

    const handleClickRename = () => {
        if (renamedFiles && renamedFiles.length > 0) {
            ipcRenderer.send(Channels.RENAME_FILES, renamedFiles);
            setEnabledRenameButton(false);
        }
    };

    const applyRename = () => {
        const candidateFiles: FileInfoModel[] = files.map(v => {
            let name = '';

            if (type === '1') {
                name = v.name.replace(replaceLookup, replaceValue);
            }
            if (type === '2') {
                name = `${replaceValue}${v.name}`;
            }
            if (type === '3') {
                name = `${v.name}${replaceValue}`;
            }
            if (type === '4') {
                // 정규식
                const regExp = new RegExp(replaceLookup, 'gi');
                name = v.name.replace(regExp, replaceValue);
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
    };

    const handleClickPreview = () => {
        applyRename();

        setEnabledRenameButton(true);
    };

    const handleClickRemoveFile = (file: FileInfoModel) => (): void => {
        setFiles(prevFiles => {
            return prevFiles.filter(f => f.fullPath !== file.fullPath);
        });

        setRenamedFiles([]);
    };

    return (
        <>
            <CssBaseline />
            <Container maxWidth={false} className={classes.root}>
                <Header title="Rename App" />

                <Box className={classes.contentWrapper}>
                    <Paper className={classes.fileInput}>
                        <FileInput handleClick={onOpenFileClick} />
                    </Paper>
                    <RenameTool onChange={handleChangeFormData} />

                    <Paper className={classes.fileInput}>
                        <ButtonGroup color="primary" variant="contained">
                            <Button
                                disabled={!enablePreviewButton}
                                onClick={handleClickPreview}
                            >
                                Preview
                            </Button>

                            <Button
                                disabled={!enabledRenameButton}
                                onClick={handleClickRename}
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
                                    handleRemoveFile={handleClickRemoveFile}
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
                <GoToTop />
                <AddFileTool
                    isOpened={openAddFileTool}
                    onOpenFileAndAppendClick={onOpenFileAndAppendClick}
                    onOpenFileClick={onOpenFileClick}
                    onOpen={handleOpenAddFileTool}
                    onClose={handleCloseAddFileTool}
                />
            </Container>
        </>
    );
};

export const RenameApp = withSnackbar(RenameAppInternal);
