import React from 'react';
import { render } from 'react-dom';
import { RenameApp } from './RenameApp';
import { SnackbarProvider } from 'notistack';

import '../scss/app.scss';

render(
    <SnackbarProvider>
        <RenameApp />
    </SnackbarProvider>,
    document.getElementById('app')
);
