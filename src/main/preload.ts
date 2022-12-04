import { contextBridge, ipcRenderer } from 'electron';
import type { IpcRendererEvent } from 'electron';
import { Channels, FileInfoModel } from '../models';

contextBridge.exposeInMainWorld('electronApi', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),
    // we can also expose variables, not just functions
    openFile: (callbackChannels: Channels[]) =>
        ipcRenderer.send(Channels.OPEN_FILE_DIALOG, [
            // Channels.GET_SELECTED_FILES,
            ...callbackChannels,
        ]),
    openFileAndAppend: (callbackChannels: Channels[]) =>
        ipcRenderer.send(Channels.OPEN_FILE_DIALOG, [
            // Channels.GET_SELECTED_FILES_APPEND,
            ...callbackChannels,
        ]),
    dropFiles: (filePaths: string[]) =>
        ipcRenderer.send(Channels.DROP_FILES, [
            Channels.GET_SELECTED_FILES,
            filePaths,
        ]),
    renameFiles: (files: FileInfoModel[]) =>
        ipcRenderer.send(Channels.RENAME_FILES, files),
    onRenameFiles: (
        callback: (_ev: IpcRendererEvent, _args?: FileInfoModel[]) => void,
    ) => ipcRenderer.on(Channels.REANME_FILES_CALLBACK, callback),
    onFileSelected: (
        callback: (_ev: IpcRendererEvent, _args?: FileInfoModel[]) => void,
    ) => ipcRenderer.on(Channels.GET_SELECTED_FILES, callback),
    onFileAppended: (
        callback: (_ev: IpcRendererEvent, _args: FileInfoModel[]) => void,
    ) => ipcRenderer.on(Channels.GET_SELECTED_FILES_APPEND, callback),
});
