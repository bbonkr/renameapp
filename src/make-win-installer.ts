import { createWindowsInstaller } from 'electron-winstaller';

createWindowsInstaller({
    // author: '@bbonkr (bbon@bbon.kr)',
    // version: '1.0.0',
    // title: 'Rename app',
    appDirectory: './pack/Rename.App-win32-x64',
    outputDirectory: './pack/installer-win32-x64',
    exe: 'Rename.App.exe',
    setupExe: 'Rename.App.exe',
})
    .then((_) => {
        console.info('Doen.');
    })
    .catch((err) => {
        console.error('Error: ', err);
    });
