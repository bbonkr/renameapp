/* eslint-disable @typescript-eslint/no-explicit-any */

import { Channels, FileInfoModel } from '../models';

/* eslint-disable no-unused-vars */
export interface IpcRender {
    on: (
        channel: string,
        listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void,
    ) => void;
    off: (
        eventName: string | symbol,
        listener: (...args: any[]) => void,
    ) => Electron.IpcRenderer;
    send: (channel: string, ...args: any[]) => void;
}

// export interface Electron {
//     ipcRenderer: IpcRender;
// }

export interface ElectronApi {
    openFileDialog: (callbackChannel?: Channels[]) => void;
    openFileDialogAndAppend: (callbackChannel?: Channels[]) => void;
    dropFiles: (files: string[]) => void;
    renameFiles: (files: FileInfoModel[]) => void;
    onRenameFiles: (
        callback: (
            _ev: Electron.IpcRendererEvent,
            _args?: FileInfoModel[],
        ) => void,
    ) => Electron.IpcRenderer;
    onFileSelected: (
        callback: (
            _ev: Electron.IpcRendererEvent,
            _args?: FileInfoModel[],
        ) => void,
    ) => Electron.IpcRenderer;
    onFileAppended: (
        callback: (
            _ev: Electron.IpcRendererEvent,
            _args: FileInfoModel[],
        ) => void,
    ) => Electron.IpcRenderer;
}

declare global {
    interface Window {
        // electron: Electron;
        electronApi: ElectronApi;
    }
}
export {};
