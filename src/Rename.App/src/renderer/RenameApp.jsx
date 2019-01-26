const React = require('react');
const FileInput = require('./FileInput.jsx');
const List = require('./List.jsx');

class RenameApp extends React.Component {
    constructor(props) {
        super(props);
        this.getFiles = getFiles.bind(this);
    }

    getFiles() {}

    render() {
        return (
            <div>
                <div>
                    <FileInput />
                </div>
                <div>
                    <List />
                </div>
            </div>
        );
    }
}

module.exports = RenameApp;
