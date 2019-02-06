'use strict';
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { format } = require('url');
const fs = require('fs');
const FileInfo = require('./FileInfo.js');

const isDevelopment = process.env.NODE_ENV === 'development';

if (require('electron-squirrel-startup')) app.quit();
// if first time install on windows, do not run application, rather
// let squirrel installer do its work
const setupEvents = require('./setup-events.js');
if (setupEvents.handleSquirrelEvent()) {
    process.exit();
}

let mainWindow;

var createMainWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 480
    });

    win.setMenu(null);

    // 개발자 도구를 엽니다.
    if (isDevelopment) {
        win.webContents.openDevTools();
    }

    // 앱의 index.html 파일을 로드합니다.
    win.loadURL(
        format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file',
            slashes: true
        })
    );
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

    win.webContents.on('devtools-opened', () => {
        win.focus();
        setImmediate(() => {
            win.focus();
        });
    });

    win.on('closed', () => {
        mainWindow = null;
    });

    return win;
};

// 이 메서드는 Electron이 초기화를 마치고
// 브라우저 창을 생성할 준비가 되었을 때  호출될 것입니다.
// 어떤 API는 이 이벤트가 나타난 이후에만 사용할 수 있습니다.
app.on('ready', () => {
    mainWindow = createMainWindow();
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
    if (mainWindow == null) {
        mainWindow = createMainWindow();
    }
});

ipcMain.on('openFileDialog', event => {
    dialog.showOpenDialog(
        mainWindow,
        { properties: ['openFile', 'multiSelections'] },
        (filePaths, bookmarks) => {
            if (filePaths) {
                var fileInfos = filePaths.map((v, i) => {
                    return getFileInfo(v);
                });

                event.sender.send('get-selected-file', fileInfos);
            } else {
                // console.log('Canceled');
            }
        }
    );
});

ipcMain.on('rename-files', (event, args) => {
    const renameFilePromise = (o, n) => {
        return new Promise((resolve, reject) => {
            fs.rename(o, n, err => {
                if (err) {
                    reject(o, err);
                } else {
                    resolve(n);
                }
            });
        });
    };

    let renameResults = args.map((v, i) => {
        let oldPath = v.fullPath;
        let dirname = path.dirname(v.fullPath);
        let extension = path.extname(v.fullPath);
        let newPath = path.join(dirname, `${v.name}${extension}`);

        let error = '';
        let hasError = false;
        let renamed = false;
        var resultName = oldPath;

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
                hasError = true;
                renamed = false;
            }
        }

        let resuleFileInfo = getFileInfo(resultName);

        resuleFileInfo.error = error;
        resuleFileInfo.renamed = renamed;
        resuleFileInfo.hasError = hasError;

        return resuleFileInfo;
    });

    // console.log('rename-files', renameResults);

    event.sender.send('renameFiles-callback', renameResults);
});

ipcMain.on('showItemInFolder', (event, args) => {
    let dirname = args['path'];
    let result = shell.showItemInFolder(dirname);

    event.sender.send('showItemInFolder-callback', result);
});

var getFileInfo = filePath => {
    let obj = new FileInfo();

    obj.extension = path.extname(filePath);
    obj.name = path.basename(filePath, obj.extension);
    obj.directoryName = path.dirname(filePath);
    obj.fullPath = filePath;
    obj.error = null;
    obj.hasError = false;
    obj.renamed = false;

    return obj;
};
