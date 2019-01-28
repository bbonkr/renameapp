const React = require('react');
const { ipcRenderer } = require('electron');

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
            <button className='btn btn-primary btn-sm' onClick={this.onClick}>
                Open files
            </button>
        );
    }
}

module.exports = FileInput;
