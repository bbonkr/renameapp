import React, { FunctionComponent } from 'react';
import { FileInfo } from '../FileInfo';
import {
    List,
    ListItem,
    ListItemText,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    Button,
    Fab,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
export interface FileListProps {
    files: FileInfo[];
    showRemoveButton?: boolean;
    handleRemoveFile?: (
        file: FileInfo,
    ) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const FileList: FunctionComponent<FileListProps> = ({
    files,
    showRemoveButton,
    handleRemoveFile,
}) => {
    return (
        <List>
            {files.map((v, i) => {
                return (
                    <ListItem key={v.fullPath}>
                        <Card style={{ width: '100%' }}>
                            <CardHeader
                                title={
                                    <Typography
                                        style={{ textOverflow: 'ellipsis' }}
                                        noWrap={false}
                                        display="inline"
                                        title={`${v.name}${v.extension}`}
                                        color="textPrimary"
                                    >
                                        {`${v.name}${v.extension}`}
                                    </Typography>
                                }
                                action={
                                    <Fab
                                        disabled={!showRemoveButton}
                                        size="small"
                                        color="primary"
                                        onClick={
                                            handleRemoveFile &&
                                            handleRemoveFile(v)
                                        }
                                    >
                                        <DeleteIcon />
                                    </Fab>
                                }
                            />
                            <CardContent>
                                <Typography color="textSecondary">
                                    {v.directoryName}
                                </Typography>
                                {v.error ? (
                                    <Typography color="error" component="pre">
                                        {v.error}
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
