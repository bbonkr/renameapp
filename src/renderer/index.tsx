import { createRoot } from 'react-dom/client';
import React from 'react';
import { RenameApp } from './components/RenameApp';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/system';
import { CssBaseline } from '@mui/material';
import { theme } from './theme';

import './css/app.css';

const container = document.getElementById('app');

if (container) {
    const root = createRoot(container);

    root.render(
        // <React.StrictMode></React.StrictMode>
        <React.Fragment>
            <CssBaseline enableColorScheme />
            <ThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={4}>
                    <RenameApp />
                </SnackbarProvider>
            </ThemeProvider>
        </React.Fragment>,
    );
} else {
    const rootElement = document.createElement('div');
    rootElement.id = 'app';
    document.append(rootElement);

    const root = createRoot(rootElement);

    root.render(
        // <React.StrictMode></React.StrictMode>
        <React.Fragment>
            <div>
                <h1>The app failed to start.</h1>
            </div>
        </React.Fragment>,
    );
}
// ReactDOM.render(
//     <React.StrictMode>
//         <React.Fragment>
//             <CssBaseline enableColorScheme />

//             <ThemeProvider theme={theme}>
//                 <SnackbarProvider maxSnack={4}>
//                     <RenameApp />
//                 </SnackbarProvider>
//             </ThemeProvider>
//         </React.Fragment>
//     </React.StrictMode>,
//     document.getElementById('app'),
// );
