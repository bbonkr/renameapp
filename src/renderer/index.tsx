import React from 'react';
import ReactDOM from 'react-dom';
import { RenameApp } from './components/RenameApp';
import { SnackbarProvider } from 'notistack';

import './css/app.css';

ReactDOM.render(
    <SnackbarProvider maxSnack={4}>
        <RenameApp />
    </SnackbarProvider>,
    document.getElementById('app'),
);
