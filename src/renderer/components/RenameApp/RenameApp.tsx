import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { IpcRendererEvent } from 'electron';
import { FileListTable } from '../FileList';
import { Box, Paper, Button, ButtonGroup, Container } from '@mui/material';
// import Typography from '@mui/material/Typography';
// import MenuIcon from '@mui/icons-material/Menu';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { SnackbarOrigin } from '@mui/material/Snackbar';
import { FileInfoModel, WindowSetting, Channels } from '../../../models';
import { AddFileTool } from '../AddFileTool';
// import { Header } from '../Header';
import { RenameTool, FormData } from '../RenameTool';
import { GoToTop } from '../GoToTop';

import './RenameApp.css';

type RenameAppProps = WithSnackbarProps;

const getNewKey = () => {
    const date = +new Date();
    return date.toString();
};

const RenameAppInternal = ({
    enqueueSnackbar,
    closeSnackbar,
}: RenameAppProps) => {
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

    const errorMessage: string = useMemo(() => {
        console.info('renamedFiles changed:', renamedFiles);

        if (!renamedFiles || renamedFiles.length === 0) {
            return '';
        }
        const errorItem = renamedFiles
            .filter(x => x.error)
            .find((_, index, arr) => index === arr.length - 1);

        if (errorItem) {
            return errorItem.error.message;
        }

        const samePathItems = renamedFiles.map(x => x.name);
        const distinctItems = new Set(samePathItems);
        if (samePathItems.length !== distinctItems.size) {
            return `Please check your rename destination. It has Same destination path.`;
        }

        return '';
    }, [renamedFiles]);

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

            window.electronApi?.dropFiles(filePaths);
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
            setFiles(_ => args);
            setRenamedFiles(_ => []);

            if (args.length > 0) {
                const snackbarKey = getNewKey();

                enqueueSnackbar('Files opened.', {
                    key: snackbarKey,
                    variant: 'info',
                    anchorOrigin: notistackAnchorOptions,
                    onClick: () => {
                        closeSnackbar(snackbarKey);
                    },
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

            setRenamedFiles(_ => []);

            if (args && args.length > 0) {
                const snackbarKey = getNewKey();
                enqueueSnackbar('Files opened.', {
                    key: snackbarKey,
                    variant: 'info',
                    anchorOrigin: notistackAnchorOptions,
                    onClick: () => {
                        closeSnackbar(snackbarKey);
                    },
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
        if (args && args.length > 0) {
            setFiles(_ => args);
            setRenamedFiles([]);

            setReplaceLookup('');
            setReplaceValue('');

            setEnablePreviewButton(false);
            setEnabledRenameButton(false);
            const snackbarKey = getNewKey();
            enqueueSnackbar('Renamed!', {
                key: snackbarKey,
                variant: 'success',
                anchorOrigin: notistackAnchorOptions,
                onClick: () => {
                    closeSnackbar(snackbarKey);
                },
            });
        }
    };

    const handleWindowLoaded = (_ev: IpcRendererEvent, args: WindowSetting) => {
        if (args) {
            setWindowSetting(_ => args);
        }
    };

    useEffect(() => {
        window.electronApi?.onRenameFiles(renameFilesCallback);
        window.electronApi?.onFileSelected(getSelectedFiles);
        window.electronApi?.onFileAppended(getSelectedFilesAndAppend);
        window.electronApi?.onWindowLoaded(handleWindowLoaded);

        window.electronApi?.windowLoaded();

        const container = containerElement.current;
        if (container) {
            container.addEventListener('drop', handleDrop);
            container.addEventListener('dragover', handleDragOver);
            container.addEventListener('dragenter', handleDragEnter);
            container.addEventListener('dragleave', handleDragLeave);
        }

        return () => {
            window.electronApi?.offRenameFiles(renameFilesCallback);
            window.electronApi?.offFileSelected(getSelectedFiles);
            window.electronApi?.offFileAppended(getSelectedFilesAndAppend);
            window.electronApi?.offWindowLoaded(handleWindowLoaded);

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

        setEnablePreviewButton(_ => previewButtonEanbeld);
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

    useEffect(() => {
        console.info('files changed', files);
    }, [files]);

    const handleOpenFileClick = () => {
        window.electronApi.openFileDialog([Channels.GET_SELECTED_FILES]);
    };

    const onOpenFileAndAppendClick = () => {
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
            window.electronApi.renameFiles(renamedFiles);
            setEnabledRenameButton(_ => false);
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

        setRenamedFiles(_ => candidateFiles);
    };

    const handleClickPreview = () => {
        applyRename();

        setEnabledRenameButton(true);
    };

    const handleClickRemoveFile = (file: FileInfoModel) => {
        setFiles(prevFiles => {
            return prevFiles.filter(f => f.fullPath !== file.fullPath);
        });

        setRenamedFiles(_ => []);

        const snackbarKey = getNewKey();
        enqueueSnackbar('Removed', {
            key: snackbarKey,
            variant: 'success',
            anchorOrigin: notistackAnchorOptions,
            onClick: () => {
                closeSnackbar(snackbarKey);
            },
        });
    };

    return (
        <>
            {/* {windowSetting && !windowSetting.isMac && (
                <Header title="Rename App" />
            )} */}
            <Container
                disableGutters
                maxWidth={false}
                className={'container-root'}
            >
                <Box className={`content-wrapper`}>
                    <Box
                        component={'div'}
                        className={`paper file-input ${
                            isDragEnter ? 'drag-enter' : ''
                        }`}
                        ref={containerElement}
                        onClick={handleOpenFileClick}
                    >
                        <p className="text-center">
                            클릭해서 파일탐색창을 열거나, 파일을 가져와서
                            놓아주세요. <br />
                            Click to open file dialog or Drag and drop files
                            Here.
                        </p>
                    </Box>
                    <Box className="content-header">
                        <RenameTool onChange={handleChangeFormData} />

                        <Paper className="paper flex">
                            <ButtonGroup color="primary" variant="contained">
                                <Button
                                    disabled={!enablePreviewButton}
                                    onClick={handleClickPreview}
                                >
                                    Preview
                                </Button>

                                <Button
                                    disabled={
                                        !enabledRenameButton ||
                                        Boolean(errorMessage)
                                    }
                                    onClick={handleClickRename}
                                >
                                    Rename
                                </Button>
                            </ButtonGroup>

                            <Box padding="0.3rem 1.2rem" color="red">
                                {errorMessage}
                            </Box>
                        </Paper>
                    </Box>
                    <Box className={`paper flex-1`}>
                        <FileListTable
                            files={files}
                            renameFiles={renamedFiles}
                            onRemoveFile={handleClickRemoveFile}
                        />
                    </Box>
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
