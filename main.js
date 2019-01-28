const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const FileInfo = require('./FileInfo.js');
let window;

var createWindow = () => {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 480
    });

    window.setMenu(null);

    // 앱의 index.html 파일을 로드합니다.
    window.loadFile('./index.html');

    // 개발자 도구를 엽니다.
    window.webContents.openDevTools();

    window.on('closed', () => {
        window = null;
    });
};

// 이 메서드는 Electron이 초기화를 마치고
// 브라우저 창을 생성할 준비가 되었을 때  호출될 것입니다.
// 어떤 API는 이 이벤트가 나타난 이후에만 사용할 수 있습니다.
app.on('ready', createWindow);

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
    if (window == null) {
        createWindow();
    }
});

ipcMain.on('openFileDialog', event => {
    dialog.showOpenDialog(
        { properties: ['openFile', 'multiSelections'] },
        (filePaths, bookmarks) => {
            if (filePaths) {
                var fileInfos = filePaths.map((v, i) => {
                    return getFileInfo(v);
                });

                event.sender.send('get-selected-file', fileInfos);
            } else {
                console.log('Canceled');
            }
        }
    );
});

ipcMain.on('rename-files', (event, args) => {
    var renameResult = args.map((v, i) => {
        let oldPath = v.fullPath;
        var dirname = path.dirname(v.fullPath);
        var extension = path.extname(v.fullPath);
        var newPath = path.join(dirname, `${v.name}${extension}`);

        let error = '';
        let hasError = false;
        let renamed = false;

        if (oldPath !== newPath) {
            console.log(`Rename: ${oldPath} ==> ${newPath}`);
            fs.rename(oldPath, newPath, err => {
                if (err) {
                    console.log(err);
                    error = err;
                    renamed = false;
                } else {
                    renamed = true;
                }
            });
        }

        return {
            name: v.name,
            extension: v.extension,
            directoryName: v.directoryName,
            fullPath: v.fullPath,
            error: error,
            hasError: hasError,
            renamed: renamed
        };
    });

    console.log('rename-files', renameResult);

    event.sender.send('renameFiles-callback', renameResult);
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
