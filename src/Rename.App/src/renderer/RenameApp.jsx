const { ipcRenderer } = require("electron");
const React = require("react");
const FileInput = require("./FileInput.jsx");
const List = require("./List.jsx");

class RenameApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            files: []
        };
    }
    componentDidMount() {
        ipcRenderer.on("get-selected-file", (ev, files) => {
            this.setState({ files: files });
        });
    }

    render() {
        const { files } = this.state;
        return (
            <div>
                <div>
                    <FileInput />
                </div>
                <hr />
                <div>
                    <div className='col-2'>
                        <div className='form-group'>
                            <label
                                htmlFor='selectOperationType'
                                className='control-label'
                            >
                                방법
                            </label>
                            <select
                                id='selectOperationType'
                                className='form-control'
                            >
                                <option value='1'>입력값으로 치환</option>
                                <option value='2'>앞에 추가</option>
                                <option value='3'>뒤에 추가</option>
                            </select>
                        </div>
                    </div>
                    <div className='col-4'>
                        <div className='form-group'>
                            <label className='control-label'>찾는 문자열</label>
                            <input type='text' className='form-control' />
                        </div>
                    </div>
                    <div className='col-4'>
                        <div className='form-group'>
                            <label className='control-label'>
                                변경할 문자열
                            </label>
                            <input type='text' className='form-control' />
                        </div>
                    </div>
                    <div className='col-2'>
                        <button type='button' className='btn btn-warning'>
                            미리보기
                        </button>
                    </div>
                </div>
                <hr />
                <div>
                    <List files={files} />
                </div>
            </div>
        );
    }
}

module.exports = RenameApp;
