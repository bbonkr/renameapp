import React, { useMemo } from 'react';
import { FileInfoModel } from '../../../models/FileInfoModel';

interface FileListItemModel {
    original: FileInfoModel;
    rename?: FileInfoModel;
}

interface FileListTableProps {
    files: FileInfoModel[];
    renameFiles: FileInfoModel[];
}

export const FileListTable = ({ files, renameFiles }: FileListTableProps) => {
    const record = useMemo(() => {
        return files.map(file => {
            const renameFile = renameFiles.find(
                x => x.fullPath === file.fullPath,
            );

            const item: FileListItemModel = {
                original: file,
                rename: renameFile,
            };

            return item;
        });
    }, [files, renameFiles]);

    return (
        <table>
            <thead>
                <tr>
                    <td>File name</td>
                    <td>Rename</td>
                    <td>Directory</td>
                    <td>Remove</td>
                </tr>
            </thead>
            <tbody>
                {record.map(item => {
                    return (
                        <tr key={item.original.fullPath}>
                            <td title={item.original.name}>
                                {item.original.name}
                            </td>
                            <td title={item.rename?.name}>
                                {item.rename?.name}
                            </td>
                            <td title={item.original.directoryName}>
                                {item.original.directoryName}
                            </td>
                            <td></td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
