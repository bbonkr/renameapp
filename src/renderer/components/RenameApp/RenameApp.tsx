import React, { useState, useEffect, useRef } from 'react';
import {
    // ipcRenderer,
    IpcRendererEvent,
} from 'electron';
import { FileListTable } from '../FileList';
import { Box, Paper, Button, ButtonGroup, Container } from '@mui/material';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { SnackbarOrigin } from '@mui/material/Snackbar';
import { FileInfoModel, WindowSetting, Channels } from '../../../models';
import { AddFileTool } from '../AddFileTool';
import { Header } from '../Header';
import { RenameTool, FormData } from '../RenameTool';
import { GoToTop } from '../GoToTop';

import './RenameApp.css';

type RenameAppProps = WithSnackbarProps;

const RenameAppInternal = ({ enqueueSnackbar }: RenameAppProps) => {
    // const ipcRenderer = window.electron.ipcRenderer;
    /** drag & drop container */
    const containerElement = useRef<HTMLDivElement>(null);

    const [files, setFiles] = useState<FileInfoModel[]>([]);
    const [renamedFiles, setRenamedFiles] = useState<FileInfoModel[]>([]);
    const [type, setType] = useState('1');
    const [replaceLookup, setReplaceLookup] = useState('');
    const [replaceValue, setReplaceValue] = useState('');
    const [enablePreviewButton, setEnablePreviewButton] = useState(false);
    const [enabledRenameButton, setEnabledRenameButton] = useState(false);
    const [openAddFileTool, setOpenAddFileTool] = useState(false);
    const [windowSetting, setWindowSetting] = useState<WindowSetting>();
    const notistackAnchorOptions: SnackbarOrigin = {
        vertical: 'top',
        horizontal: 'right',
    };
    const [isDragEnter, setIsDragEnter] = useState(false);

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

    const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();

        console.info('[RENDERER][FileInput][Drop]', event.dataTransfer?.files);
        const files = event.dataTransfer?.files;
        if (files) {
            const filePaths: string[] = [];

            for (let i = 0; i < files.length; i++) {
                const fileItem = files.item(i);
                if (fileItem) {
                    filePaths.push(fileItem.path);
                }
            }

            // ipcRenderer.send(Channels.DROP_FILES, [
            //     Channels.GET_SELECTED_FILES,
            //     filePaths,
            // ]);
            window.electronApi.dropFiles(filePaths);
        }
        setIsDragEnter(_ => false);
    };

    const handleDragOver = (event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        console.info('[RENDERER][FileInput][DragOver]');
        // setIsDragEnter(_ => true);
    };

    const handleDragEnter = (event: DragEvent) => {
        event.stopPropagation();
        console.info('[RENDERER][FileInput][DragEnter]');
        setIsDragEnter(_ => true);
    };

    const handleDragLeave = (_event: DragEvent) => {
        // event.stopPropagation();
        console.info('[RENDERER][FileInput][DragLeave]');
        setIsDragEnter(_ => false);
    };

    const getSelectedFiles = (
        _ev: IpcRendererEvent,
        args?: FileInfoModel[],
    ) => {
        console.info('[RENDERER][getSelectedFiles] args: ', args);

        if (args) {
            setFiles(args);
            setRenamedFiles([]);
            if (args && args.length > 0) {
                enqueueSnackbar('Files opened.', {
                    key: getNewKey(),
                    variant: 'info',
                    anchorOrigin: notistackAnchorOptions,
                });
            }
        }

        // 앱 버튼 닫기
        setOpenAddFileTool(_ => false);
    };

    const getSelectedFilesAndAppend = (
        _ev: IpcRendererEvent,
        args: FileInfoModel[],
    ) => {
        if (args) {
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
        }

        // 앱 버튼 닫기
        setOpenAddFileTool(_ => false);
    };

    const renameFilesCallback = (
        _ev: IpcRendererEvent,
        args?: FileInfoModel[],
    ) => {
        if (args) {
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
        }
    };

    const handleWindowLoaded = (_ev: IpcRendererEvent, args: WindowSetting) => {
        if (args) {
            setWindowSetting(_ => args);
        }
    };

    useEffect(() => {
        // ipcRenderer.on(Channels.REANME_FILES_CALLBACK, renameFilesCallback);
        window.electronApi.onRenameFiles(renameFilesCallback);

        // ipcRenderer.on(Channels.GET_SELECTED_FILES, getSelectedFiles);
        window.electronApi.onFileSelected(getSelectedFiles);

        // ipcRenderer.on(
        //     Channels.GET_SELECTED_FILES_APPEND,
        //     getSelectedFilesAndAppend,
        // );
        window.electronApi.onFileAppended(getSelectedFilesAndAppend);

        ipcRenderer.on(Channels.WINDOW_LOADED_CALLBACK, handleWindowLoaded);

        ipcRenderer.send(Channels.WINDOW_LOADED, []);

        const container = containerElement.current;
        if (container) {
            container.addEventListener('drop', handleDrop);
            container.addEventListener('dragover', handleDragOver);
            container.addEventListener('dragenter', handleDragEnter);
            container.addEventListener('dragleave', handleDragLeave);
        }

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
            ipcRenderer.off(
                Channels.WINDOW_LOADED_CALLBACK,
                handleWindowLoaded,
            );

            if (container) {
                container.removeEventListener('dragleave', handleDragLeave);
                container.removeEventListener('dragenter', handleDragEnter);
                container.removeEventListener('dragover', handleDragOver);
                container.removeEventListener('drop', handleDrop);
            }
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

    useEffect(() => {
        console.info('window setting', windowSetting);
    }, [windowSetting]);

    const handleOpenFileClick = () => {
        // ipcRenderer.send(Channels.OPEN_FILE_DIALOG, [
        //     Channels.GET_SELECTED_FILES,
        // ]);

        window.electronApi.openFileDialog([Channels.GET_SELECTED_FILES]);
    };

    const onOpenFileAndAppendClick = () => {
        // ipcRenderer.send(Channels.OPEN_FILE_DIALOG, [
        //     Channels.GET_SELECTED_FILES_APPEND,
        // ]);
        window.electronApi.openFileDialog([Channels.GET_SELECTED_FILES_APPEND]);
    };

    const handleOpenAddFileTool = () => {
        setOpenAddFileTool(_ => true);
    };
    const handleCloseAddFileTool = () => {
        setOpenAddFileTool(_ => false);
    };

    const handleClickRename = () => {
        if (renamedFiles && renamedFiles.length > 0) {
            // ipcRenderer.send(Channels.RENAME_FILES, renamedFiles);
            window.electronApi.renameFiles(renamedFiles);
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
                name,
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

    const handleClickRemoveFile = (file: FileInfoModel) => {
        setFiles(prevFiles => {
            return prevFiles.filter(f => f.fullPath !== file.fullPath);
        });

        setRenamedFiles([]);
    };

    return (
        <>
            {windowSetting && !windowSetting.isMac && (
                <Header title="Rename App" />
            )}
            <Container
                disableGutters
                maxWidth={false}
                className={'container-root'}
            >
                <Box className={`content-wrapper`}>
                    <Paper
                        component={'div'}
                        className={`paper file-input ${
                            isDragEnter ? 'drag-enter' : ''
                        }`}
                        ref={containerElement}
                        onClick={handleOpenFileClick}
                    >
                        Click to open file dialog or Drag and drop files Here.
                    </Paper>
                    <RenameTool onChange={handleChangeFormData} />

                    <Paper className={`paper`}>
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
                    <Paper className={`paper flex-1`}>
                        <FileListTable
                            files={files}
                            renameFiles={renamedFiles}
                            onRemoveFile={handleClickRemoveFile}
                        />
                    </Paper>
                </Box>
                <GoToTop />
                <AddFileTool
                    isOpened={openAddFileTool}
                    onOpenFileAndAppendClick={onOpenFileAndAppendClick}
                    onOpenFileClick={handleOpenFileClick}
                    onOpen={handleOpenAddFileTool}
                    onClose={handleCloseAddFileTool}
                />
            </Container>
        </>
    );
};

export const RenameApp = withSnackbar(RenameAppInternal);
