import { app, BrowserWindow, dialog, ipcMain, Menu, shell } from 'electron';
import fs from 'fs';
import path from 'path';
import { format } from 'url';
import { FileInfo } from './FileInfo.js';
import setupEvents from './setup-events.js';
import { Channels } from './typings/channels.js';

// const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV !== 'production';

if (require('electron-squirrel-startup')) {
    app.quit();
}
// if (require('electron-squirrel-startup')) return;
// if first time install on windows, do not run application, rather
// let squirrel installer do its work
// const setupEvents = require('./setup-events.js');
if (setupEvents.handleSquirrelEvent()) {
    process.exit();
}

let mainWindow: BrowserWindow | null;

const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 480,
        title: 'Rename App',
        // renderer console error
        // resolve: Uncaught ReferenceError: require is not defined
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // if (process.platform !== 'darwin') {
    //     mainWindow.setMenu(null);
    // }

    // 개발자 도구를 엽니다.
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    // if (isDev) {
    //     mainWindow
    //         .loadURL('http://localhost:3000')
    //         .then(() => {
    //             console.info('[MAIN] Window Loaded.');
    //         })
    //         .catch(err => {
    //             console.error(err);
    //         });
    //     mainWindow.webContents.openDevTools();
    // } else {}
    // 앱의 index.html 파일을 로드합니다.
    mainWindow
        .loadURL(
            format({
                pathname: path.join(__dirname, '../index.html'),
                protocol: 'file',
                slashes: true,
            }),
        )
        .then(() => {
            console.info('[MAIN] Window Loaded.');
        })
        .catch(err => {
            console.error(err);
        });

    // if (isDevelopment) {
    //     win.loadURL(
    //         `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
    //     );
    // } else {
    //     win.loadURL(
    //         formatUrl({
    //             pathname: path.join(__dirname, 'index.html'),
    //             protocol: 'file',
    //             slashes: true
    //         })
    //     );
    // }

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
    });
};

// 이 메서드는 Electron이 초기화를 마치고
// 브라우저 창을 생성할 준비가 되었을 때  호출될 것입니다.
// 어떤 API는 이 이벤트가 나타난 이후에만 사용할 수 있습니다.
app.on('ready', () => {
    createMainWindow();

    if (mainWindow && process.platform !== 'darwin') {
        mainWindow.setMenu(null);
        Menu.setApplicationMenu(null);
    }
});

app.on('window-all-closed', () => {
    // macOS에서는 사용자가 명확하게 Cmd + Q를 누르기 전까지는
    // 애플리케이션이나 메뉴 바가 활성화된 상태로 머물러 있는 것이 일반적입니다.
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // macOS에서는 dock 아이콘이 클릭되고 다른 윈도우가 열려있지 않았다면
    // 앱에서 새로운 창을 다시 여는 것이 일반적입니다.
    if (!mainWindow) {
        createMainWindow();
    }
});

ipcMain.on(
    Channels.OPEN_FILE_DIALOG,
    (event: Electron.IpcMainEvent, args: any[]): void => {
        const callbackChannel: Channels =
            args && args.length > 0 ? args[0] : Channels.GET_SELECTED_FILES;

        if (mainWindow) {
            dialog
                .showOpenDialog(mainWindow, {
                    properties: ['openFile', 'multiSelections'],
                })
                .then(result => {
                    const { filePaths } = result;
                    if (filePaths) {
                        const fileInfos = filePaths
                            .sort((a: string, b: string): number => {
                                return a > b ? 1 : -1;
                            })
                            .map(
                                (v: string): FileInfo => {
                                    // return getFileInfo(v);
                                    return FileInfo.fromFilePath(v);
                                },
                            );

                        event.sender.send(
                            // Channels.GET_SELECTED_FIELS,
                            callbackChannel,
                            fileInfos,
                        );
                    } else {
                        // console.log('Canceled');
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        }
    },
);

ipcMain.on(Channels.RENAME_FILES, (event, args) => {
    const renameFilePromise = (o: string, n: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            fs.renameSync(o, n);
        });
    };

    const renameResults = args.map((v: any, i: any) => {
        const oldPath = v.fullPath;
        const dirname = path.dirname(v.fullPath);
        const extension = path.extname(v.fullPath);
        const newPath = path.join(dirname, `${v.name}${extension}`);

        let error = '';
        const hasError = false;

        let renamed = false;
        let resultName = oldPath;

        if (oldPath !== newPath) {
            // console.log(`Rename: ${oldPath} ==> ${newPath}`);
            // async
            // fs.rename(oldPath, newPath, err => {
            //     if (err) {
            //         error = err.message;
            //         renamed = false;
            //         hasError = true;
            //     } else {
            //         error = null;
            //         renamed = true;
            //         hasError = false;
            //     }
            // });

            // promise
            // renameFilePromise(oldPath, newPath)
            //     .then(t => {
            //         resultName = t;
            //     })
            //     .catch((t, err) => {
            //         resultName = t;
            //         hasError = true;
            //         error = err;
            //     });

            // sync
            try {
                fs.renameSync(oldPath, newPath);
                resultName = newPath;
                renamed = true;
            } catch (err) {
                resultName = oldPath;
                error = err;
                renamed = false;
            }
        }

        const resuleFileInfo = FileInfo.fromFilePath(resultName);

        resuleFileInfo.error = error;
        resuleFileInfo.renamed = renamed;

        return resuleFileInfo;
    });

    event.sender.send(Channels.REANME_FILES_CALLBACK, renameResults);
});

ipcMain.on('showItemInFolder', (event, args) => {
    const dirname = args['path'];
    const result = shell.showItemInFolder(dirname);

    event.sender.send('showItemInFolder-callback', result);
});
