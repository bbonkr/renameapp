import React from 'react';
import { FileInfoModel } from '../../../models';
import {
    List,
    ListItem,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Fab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface FileListProps {
    files: FileInfoModel[];
    showRemoveButton?: boolean;
    handleRemoveFile?: (
        _file: FileInfoModel,
    ) => (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const FileList = ({
    files,
    showRemoveButton,
    handleRemoveFile,
}: FileListProps) => {
    return (
        <List>
            {files.map(file => {
                return (
                    <ListItem key={file.fullPath}>
                        <Card style={{ width: '100%' }}>
                            <CardHeader
                                title={
                                    <Typography
                                        style={{ textOverflow: 'ellipsis' }}
                                        noWrap={false}
                                        display="inline"
                                        title={`${file.name}${file.extension}`}
                                        color="textPrimary"
                                    >
                                        {`${file.name}${file.extension}`}
                                    </Typography>
                                }
                                action={
                                    <Fab
                                        disabled={!showRemoveButton}
                                        size="small"
                                        color="primary"
                                        onClick={
                                            handleRemoveFile &&
                                            handleRemoveFile(file)
                                        }
                                    >
                                        <DeleteIcon />
                                    </Fab>
                                }
                            />
                            <CardContent>
                                <Typography color="textSecondary">
                                    {file.directoryName}
                                </Typography>
                                {file.error ? (
                                    <Typography color="error" component="pre">
                                        {file.error}
                                    </Typography>
                                ) : null}
                            </CardContent>
                        </Card>
                    </ListItem>
                );
            })}
        </List>
    );
};
