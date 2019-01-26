const { app, BrowserWindow, ipcMain, dialog } = require('electron');

let window;

var createWindow = () => {
    window = new BrowserWindow({ width: 800, height: 600 });
    // 앱의 index.html 파일을 로드합니다.
    window.loadFile('index.html');

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
                for (var file in filePaths) {
                    console.log('files: ', file);
                }
                filePaths.map((value, index, arr) => {
                    console.log(`file ${index}:`, value);
                });

                event.sender.send('get-selected-file', filePaths);
            } else {
                console.log('취소됨');
            }
        }
    );
});
