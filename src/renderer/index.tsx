import React from 'react';
import ReactDOM from 'react-dom';
import { RenameApp } from './components/RenameApp';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/system';
import { CssBaseline } from '@mui/material';
import { theme } from './theme';

import './css/app.css';

ReactDOM.render(
    <React.StrictMode>
        <React.Fragment>
            <CssBaseline enableColorScheme />

            <ThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={4}>
                    <RenameApp />
                </SnackbarProvider>
            </ThemeProvider>
        </React.Fragment>
    </React.StrictMode>,
    document.getElementById('app'),
);
