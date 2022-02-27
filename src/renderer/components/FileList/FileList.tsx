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
    onRemoveFile?: (_file: FileInfoModel) => void;
}

export const FileList = ({
    files,
    showRemoveButton,
    onRemoveFile,
}: FileListProps) => {
    const handleRemove = (item: FileInfoModel) => () => {
        if (onRemoveFile) {
            onRemoveFile(item);
        }
    };

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
                                        onClick={handleRemove(file)}
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
