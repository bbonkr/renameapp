import React from 'react';
import ReactDOM from 'react-dom';
import { RenameApp } from './RenameApp';
import { SnackbarProvider } from 'notistack';

// import '../scss/app.scss';

ReactDOM.render(
    <SnackbarProvider maxSnack={4}>
        <RenameApp />
    </SnackbarProvider>,
    document.getElementById('app'),
);
