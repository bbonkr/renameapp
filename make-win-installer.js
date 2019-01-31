var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './pack/Rename.App-win32-x64',
    outputDirectory: './pack/installer-win32-x64',
    exe: 'Rename.App.exe',
    setupExe: 'Rename.App.Setup.exe'
});

resultPromise.then(
    function() {
        console.log('Doen.');
    },
    function(e) {
        console.log('Error: ' + e.message);
    }
);
