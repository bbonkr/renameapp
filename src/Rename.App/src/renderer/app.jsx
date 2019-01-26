//import 'bootstrap';
import '../scss/app.scss';

const React = require('react');
const ReactDOM = require('react-dom');
const RenameApp = require('./RenameApp.jsx');

ReactDOM.render(
    <div>
        <div>
            <RenameApp />
        </div>
    </div>,
    document.getElementById('app')
);
