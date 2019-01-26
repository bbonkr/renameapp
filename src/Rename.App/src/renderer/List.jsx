const React = require('react');
const { ipcRenderer } = require('electron');

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = { files: [] };
    }
    componentDidMount() {
        ipcRenderer.on('get-selected-file', (ev, files) => {
            this.setState({ files: files });
        });
    }
    render() {
        const { files } = this.state;
        return (
            <ul>
                {files.map((v, i) => {
                    return <li key={i}>{v}</li>;
                })}
            </ul>
        );
    }
}

module.exports = List;
