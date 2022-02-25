import React, { useMemo } from 'react';
import { FileInfoModel } from '../../../models/FileInfoModel';
import {
    Table,
    TableHead,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    Fab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import './FileListTable.css';

interface FileListItemModel {
    original: FileInfoModel;
    rename?: FileInfoModel;
}

interface FileListTableProps {
    files: FileInfoModel[];
    renameFiles: FileInfoModel[];
    onRemoveFile?: (_file: FileInfoModel) => void;
}

export const FileListTable = ({
    files,
    renameFiles,
    onRemoveFile,
}: FileListTableProps) => {
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

    const handleRemoveFileItem = (item: FileInfoModel) => () => {
        if (onRemoveFile) {
            onRemoveFile(item);
        }
    };

    return (
        <>
            <TableContainer className="file-list-table-container">
                <Table stickyHeader size="medium" padding="normal">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                component="th"
                                scope="col"
                                variant="head"
                            >
                                Remove
                            </TableCell>
                            <TableCell
                                component="th"
                                scope="col"
                                variant="head"
                            >
                                File name
                            </TableCell>
                            <TableCell
                                component="th"
                                scope="col"
                                variant="head"
                            >
                                Rename
                            </TableCell>
                            <TableCell
                                component="th"
                                scope="col"
                                variant="head"
                            >
                                Directory
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {record.map(item => {
                            return (
                                <TableRow key={item.original.fullPath}>
                                    <TableCell>
                                        <Fab
                                            size="small"
                                            color="error"
                                            onClick={handleRemoveFileItem(
                                                item.original,
                                            )}
                                        >
                                            <DeleteIcon />
                                        </Fab>
                                    </TableCell>
                                    <TableCell title={item.original.name}>
                                        {item.original.name}
                                    </TableCell>
                                    <TableCell title={item.rename?.name}>
                                        {item.rename?.name}
                                    </TableCell>
                                    <TableCell
                                        title={item.original.directoryName}
                                    >
                                        {item.original.directoryName}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};
