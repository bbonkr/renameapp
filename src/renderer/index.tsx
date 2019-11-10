import React from 'react';
import ReactDOM from 'react-dom';
import { RenameApp } from './RenameApp';
import { SnackbarProvider } from 'notistack';

// import '../scss/app.scss';

ReactDOM.render(
    <SnackbarProvider>
        <RenameApp />
    </SnackbarProvider>,
    document.getElementById('app')
);
