import React, { useMemo } from 'react';
import { FileInfoModel } from '../../../models/FileInfoModel';
import {
    Table,
    TableHead,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HourglassEmptyOutlined from '@mui/icons-material/HourglassEmptyOutlined';
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
            <TableContainer className={`file-list-table-container`}>
                <Table
                    stickyHeader
                    size="medium"
                    padding="normal"
                    className={`${files.length === 0 && 'no-files'}`}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell
                                component="th"
                                scope="col"
                                variant="head"
                                align="center"
                            >
                                #
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
                        {record.length > 0 ? (
                            record.map(item => {
                                return (
                                    <TableRow key={item.original.fullPath}>
                                        <TableCell align="center">
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={handleRemoveFileItem(
                                                    item.original,
                                                )}
                                                title="Remove item from list"
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </TableCell>
                                        <TableCell title={item.original.name}>
                                            <span>{item.original.name}</span>
                                            <span>
                                                {item.original.extension}
                                            </span>
                                        </TableCell>
                                        <TableCell title={item.rename?.name}>
                                            <span>
                                                <mark>{item.rename?.name}</mark>
                                            </span>
                                            <span>
                                                {item.rename?.name &&
                                                    item.rename?.extension}
                                            </span>
                                        </TableCell>
                                        <TableCell
                                            title={item.original.directoryName}
                                        >
                                            {item.original.directoryName}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    align="center"
                                    valign="middle"
                                >
                                    <div className="no-data">
                                        <div>
                                            <HourglassEmptyOutlined fontSize="large" />
                                        </div>
                                        <div>No files selected.</div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};
