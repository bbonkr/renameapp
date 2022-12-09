import electron, {
    app,
    dialog,
    ipcMain,
    Menu,
    nativeTheme,
    shell,
} from 'electron';
import fs from 'fs';
import path from 'path';
import { FileInfoModel } from '../models';
import { format, URL } from 'url';
import { FileInfo } from '../lib/FileInfo';
// import setupEvents from './setup-events';
import { Channels } from '../models/channels';

// const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

// if (isDev) {
//     import('electron-reload').then(m => {
//         m.default(__dirname);
//     });
// }

// if (require('electron-squirrel-startup')) {
//     app.quit();
// }
// if (require('electron-squirrel-startup')) return;
// if first time install on windows, do not run application, rather
// let squirrel installer do its work
// const setupEvents = require('./setup-events.js');
// if (setupEvents.handleSquirrelEvent()) {
//     process.exit();
// }

let mainWindow: electron.BrowserWindow | null;

const createFileInfos = (files: string[]): FileInfo[] | undefined => {
    if (files.length === 0) {
        return undefined;
    }

    const fileInfos = FileInfo.fromPath(files);

    return fileInfos.sort((a, b): number => {
        return a.fullPath > b.fullPath ? 1 : -1;
    });
};

const handleOpenFileDialog = (
    _event: Electron.IpcMainEvent,
    args: any[],
): void => {
    const callbackChannel: Channels =
        args && args.length > 0 ? args[0] : Channels.GET_SELECTED_FILES;

    if (mainWindow) {
        dialog
            .showOpenDialog(mainWindow, {
                properties: ['openFile', 'multiSelections'],
            })
            .then(result => {
                const { canceled, filePaths } = result;

                if (!canceled) {
                    if (filePaths) {
                        const fileInfos = createFileInfos(filePaths);
                        if (fileInfos) {
                            // event.sender.send(callbackChannel, fileInfos);
                            console.info('[main][handleOpenFileDialog]');
                            mainWindow?.webContents.send(
                                callbackChannel,
                                fileInfos,
                            );
                        }
                    }
                } else {
                    console.info('[MAIN][OPEN_FILE_DIALOG] Cancled');
                }
            })
            .catch(err => {
                console.error(err);
            });
    }
};

const handleDropFiles = (_event: Electron.IpcMainEvent, args: any[]) => {
    const callbackChannel: Channels =
        args && args.length > 0 ? args[0] : Channels.GET_SELECTED_FILES;
    const files = args && args.length > 1 ? args[1] : [];
    if (files) {
        const fileInfos = createFileInfos(files);

        // event.sender.send(callbackChannel, fileInfos);
        mainWindow?.webContents.send(callbackChannel, fileInfos);
    }
};

const handleRenameFiles = (_event: Electron.IpcMainEvent, args: any) => {
    const files: FileInfoModel[] = args;

    const renameResults = files.map(v => {
        const oldPath = v.fullPath;
        const dirname = path.dirname(v.fullPath);
        const extension = path.extname(v.fullPath);
        const newPath = path.join(dirname, `${v.name}${extension}`);

        let error = '';

        let renamed = false;
        let resultName = oldPath;

        if (oldPath !== newPath) {
            // sync
            try {
                const newPathIsExists = fs.existsSync(newPath);

                if (newPathIsExists) {
                    throw new Error(
                        `Path is exists already. (target: ${newPath})`,
                    );
                }

                // Rename
                fs.renameSync(oldPath, newPath);
                resultName = newPath;
                renamed = true;
            } catch (err) {
                resultName = oldPath;
                renamed = false;
                if (err instanceof Error) {
                    error = err.message;
                }
            }
        }

        const resuleFileInfo = FileInfo.fromFilePath(resultName);

        resuleFileInfo.error = error;
        resuleFileInfo.renamed = renamed;

        return resuleFileInfo;
    });

    // event.sender.send(Channels.REANME_FILES_CALLBACK, renameResults);
    mainWindow?.webContents.send(Channels.REANME_FILES_CALLBACK, renameResults);
};

const handleWindowLoaded = (_event: Electron.IpcMainEvent, _args?: any) => {
    // event.sender.send(Channels.WINDOW_LOADED_CALLBACK, {
    //     isMac: process.platform === 'darwin',
    //     isDark: nativeTheme.shouldUseDarkColors,
    // });

    mainWindow?.webContents.send(Channels.WINDOW_LOADED_CALLBACK, {
        isMac: process.platform === 'darwin',
        isDark: nativeTheme.shouldUseDarkColors,
    });
};

const createMainWindow = () => {
    mainWindow = new electron.BrowserWindow({
        width: 800,
        height: 640,
        minWidth: 800,
        minHeight: 640,
        title: 'Rename App',
        frame: isMac,
        titleBarStyle: isMac ? 'default' : 'hidden',
        // renderer console error
        // resolve: Uncaught ReferenceError: require is not defined
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // 개발자 도구를 엽니다.
    // if (isDev) {
    //     mainWindow.webContents.openDevTools();
    // }

    if (isDev) {
        mainWindow
            .loadURL('http://localhost:26498')
            .then(() => {
                console.info('[MAIN:DEV] Window Loaded.');
            })
            .catch(err => {
                console.error(err);
            });
        mainWindow.webContents.openDevTools();
    } else {
        // 앱의 index.html 파일을 로드합니다.
        const url = new URL(`file:///${path.join(__dirname, './index.html')}`);
        mainWindow
            .loadURL(format(url))
            .then(() => {
                console.info('[MAIN] Window Loaded.');
            })
            .catch(err => {
                console.error(err);
            });
    }

    mainWindow.webContents.on('devtools-opened', () => {
        if (mainWindow) {
            mainWindow.focus();
            setImmediate(() => {
                if (mainWindow) {
                    mainWindow.focus();
                }
            });
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
        if (!isMac) {
            app.quit();
        }
    });
};

// 이 메서드는 Electron이 초기화를 마치고 브라우저 창을 생성할 준비가 되었을 때 호출될 것입니다.
// 어떤 API는 이 이벤트가 나타난 이후에만 사용할 수 있습니다.
app.whenReady().then(() => {
    ipcMain.on(Channels.OPEN_FILE_DIALOG, handleOpenFileDialog);
    ipcMain.on(Channels.DROP_FILES, handleDropFiles);
    ipcMain.on(Channels.RENAME_FILES, handleRenameFiles);
    ipcMain.on(Channels.WINDOW_LOADED, handleWindowLoaded);

    ipcMain.on('showItemInFolder', (_event, args) => {
        const dirname = args.path;
        const result = shell.showItemInFolder(dirname);

        // event.sender.send('showItemInFolder-callback', result);
        mainWindow?.webContents.send('showItemInFolder-callback', result);
    });

    ipcMain.on(Channels.WINDOW_CLOSE, (_, __) => {
        console.info(`[IPC-MAIN] ${Channels.WINDOW_CLOSE}`);

        if (mainWindow?.webContents.isDevToolsOpened()) {
            mainWindow?.webContents.closeDevTools();
        }
        mainWindow?.close();
    });

    ipcMain.on(Channels.WINDOW_MINIMIZE, (_, __) => {
        console.info(`[IPC-MAIN] ${Channels.WINDOW_MINIMIZE}`);

        mainWindow?.minimize();
    });

    ipcMain.on(Channels.WINDOW_MAXIMIZE, (_, __) => {
        console.info(`[IPC-MAIN] ${Channels.WINDOW_MAXIMIZE}`);

        const isMaximized = mainWindow?.isMaximized();
        const isMaximizable = mainWindow?.isMaximizable();
        if (
            typeof isMaximized === 'boolean' &&
            typeof isMaximizable === 'boolean'
        ) {
            if (!isMaximized && isMaximizable) {
                mainWindow?.maximize();
            } else {
                mainWindow?.unmaximize();
            }
        }
    });

    app.on('activate', () => {
        // macOS에서는 dock 아이콘이 클릭되고 다른 윈도우가 열려있지 않았다면 앱에서 새로운 창을 다시 여는 것이 일반적입니다.
        if (!mainWindow) {
            createMainWindow();
        }
    });

    createMainWindow();

    if (mainWindow && process.platform !== 'darwin') {
        // 메뉴 사용안함
        mainWindow.setMenu(null);
        Menu.setApplicationMenu(null);
    }
});

app.on('window-all-closed', () => {
    // macOS에서는 사용자가 명확하게 Cmd + Q를 누르기 전까지는 애플리케이션이나 메뉴 바가 활성화된 상태로 머물러 있는 것이 일반적입니다.
    if (!isMac) {
        app.quit();
    }
});
