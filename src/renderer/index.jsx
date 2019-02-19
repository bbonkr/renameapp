import '../scss/app.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import RenameApp from './RenameApp.jsx';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

const options = {
    position: 'top right',
    timeout: 2000,
    offset: '30px',
    transition: 'scale'
};

ReactDOM.render(
    <div>
        <AlertProvider template={AlertTemplate} {...options}>
            <RenameApp />
        </AlertProvider>
    </div>,
    document.getElementById('app')
);
