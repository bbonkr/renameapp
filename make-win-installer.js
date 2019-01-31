var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    // author: '@bbonkr (bbon@bbon.kr)',
    // version: '1.0.0',
    // title: 'Rename app',
    appDirectory: './pack/Rename.App-win32-x64',
    outputDirectory: './pack/installer-win32-x64',
    exe: 'Rename.App.exe',
    setupExe: 'Rename.App.exe'
});

resultPromise.then(
    function() {
        console.log('Doen.');
    },
    function(e) {
        console.log('Error: ' + e.message);
    }
);
