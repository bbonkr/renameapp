import { makeStyles, createStyles, Theme } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            padding: 0,
            margin: 0,
        },
        contentWrapper: {
            padding: '0.8rem',
        },
        contentContainer: {
            margin: '0 0.3rem',
        },

        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        formContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            paddingLeft: '0.8rem',
            paddingRight: '0.8rem',
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            // width: 200,
        },
        fileInput: {
            padding: '1.8rem 1.0rem',
            margin: '0.3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
        },
        dragEnter: {
            borderStyle: 'dashed',
            borderColor: '#F83204',
        },
    }),
);
