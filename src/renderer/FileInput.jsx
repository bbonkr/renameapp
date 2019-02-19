import React from 'react';
import { ipcRenderer } from 'electron';

class FileInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.onClick = this.onClick.bind(this);
    }
    onClick(event) {
        ipcRenderer.send('openFileDialog');
    }
    render() {
        return (
            <button
                className='demo-button mdc-button mdc-button--raised mdc-ripple-upgraded'
                onClick={this.onClick}
            >
                <span class='mdc-button__label'>Open files</span>
            </button>
        );
    }
}

export default FileInput;
