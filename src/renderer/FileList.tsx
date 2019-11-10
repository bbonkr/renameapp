import React, { FunctionComponent } from 'react';
import { FileInfo } from '../FileInfo';
import {
    List,
    ListItem,
    ListItemText,
    Card,
    CardContent,
    Typography,
} from '@material-ui/core';

export interface IListProps {
    files: FileInfo[];
}

export const FileList: FunctionComponent<IListProps> = ({ files }) => {
    return (
        <List>
            {files.map((v, i) => {
                // let liClasses =
                //     'list-group-item list-group-item-action d-flex justify-content-between align-items-center';

                // if (v.error) {
                //     liClasses += ' list-group-item-danger';
                // } else if (v.renamed) {
                //     liClasses += ' list-group-item-success';
                // }

                return (
                    <ListItem key={v.fullPath}>
                        <Card>
                            <CardContent>
                                <Typography color="textPrimary">
                                    {`${v.name}${v.extension}`}
                                </Typography>
                                <Typography color="textSecondary">
                                    {v.directoryName}
                                </Typography>
                                {v.error ? (
                                    <Typography color="error">
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
