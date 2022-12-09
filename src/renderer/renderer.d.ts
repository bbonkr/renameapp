/* eslint-disable @typescript-eslint/no-explicit-any */

import { Channels, FileInfoModel, WindowSetting } from '../models';
import type { IpcRendererEvent } from 'electron';

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

export interface ElectronApi {
    // renderer to main
    openFileDialog: (callbackChannel?: Channels[]) => void;
    openFileDialogAndAppend: (callbackChannel?: Channels[]) => void;
    dropFiles: (files: string[]) => void;
    renameFiles: (files: FileInfoModel[]) => void;
    windowLoaded: () => void;
    windowClose: () => void;
    windowMinimize: () => void;
    windowMaximize: () => void;

    // main to renderer
    onRenameFiles: (
        callback: (_ev: IpcRendererEvent, _args?: FileInfoModel[]) => void,
    ) => Electron.IpcRenderer;
    onFileSelected: (
        callback: (_ev: IpcRendererEvent, _args?: FileInfoModel[]) => void,
    ) => Electron.IpcRenderer;
    onFileAppended: (
        callback: (_ev: IpcRendererEvent, _args: FileInfoModel[]) => void,
    ) => Electron.IpcRenderer;
    onWindowLoaded: (
        callback: (_ev: IpcRendererEvent, _args: WindowSetting) => void,
    ) => Electron.IpcRenderer;

    offRenameFiles: (
        callback: (_ev: IpcRendererEvent, _args?: FileInfoModel[]) => void,
    ) => Electron.IpcRenderer;
    offFileSelected: (
        callback: (_ev: IpcRendererEvent, _args?: FileInfoModel[]) => void,
    ) => Electron.IpcRenderer;
    offFileAppended: (
        callback: (_ev: IpcRendererEvent, _args: FileInfoModel[]) => void,
    ) => Electron.IpcRenderer;
    offWindowLoaded: (
        callback: (_ev: IpcRendererEvent, _args: WindowSetting) => void,
    ) => Electron.IpcRenderer;
}

declare global {
    interface Window {
        electronApi: ElectronApi;
    }
}
export {};
