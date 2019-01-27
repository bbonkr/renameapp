const { ipcRenderer } = require('electron');
const React = require('react');
const FileInput = require('./FileInput.jsx');
const List = require('./List.jsx');

class RenameApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            renamedFiles: [],
            type: '2',
            append: '',
            lookup: '',
            replace: '',
            lookupRegExp: '',
            replaceRegExp: '',
            enablePreviewButton: false,
            enabledRenameButton: false
        };

        this.types = [
            { key: '1', value: '입력값으로 치환' },
            { key: '2', value: '앞에 추가' },
            { key: '3', value: '뒤에 추가' },
            { key: '4', value: '정규식으로 치환' }
        ];

        this.onTypeChanged = this.onTypeChanged.bind(this);
        this.onAppendChanged = this.onAppendChanged.bind(this);
        this.onLookupChanged = this.onLookupChanged.bind(this);
        this.onReplaceChanged = this.onReplaceChanged.bind(this);
        this.onLookupRegExpChanged = this.onLookupRegExpChanged.bind(this);
        this.onReplaceRegExpChanged = this.onReplaceRegExpChanged.bind(this);

        this.onPreviewClick = this.onPreviewClick.bind(this);
        this.onRenameClick = this.onRenameClick.bind(this);
    }
    componentDidMount() {
        ipcRenderer.on('get-selected-file', (ev, files) => {
            this.setState({
                files: files,
                renamedFiles: []
            });
        });

        ipcRenderer.on('renameFiles-callback', (ev, renameResult) => {
            const { renamedFiles } = this.state;

            let results = renamedFiles.map((renamedFile, i) => {
                let foundItem = renameResult.find((renameFileResult, i) => {
                    return renamedFile.fullPath === renameFileResult.fullPath;
                });

                let error = null;
                let hasError = false;
                let renamed = false;
                if (foundItem) {
                    renamed = foundItem.renamed;
                    error = foundItem.error;
                    if (error) {
                        hasError = true;
                    }
                }

                return {
                    name: renamedFile.name,
                    extension: renamedFile.extension,
                    directoryName: renamedFile.directoryName,
                    fullPath: renamedFile.fullPath,
                    hasError: hasError,
                    error: error,
                    renamed: renamed
                };
            });

            this.setState({ renamedFiles: results });
        });
    }

    onTypeChanged(event) {
        let selectedValue = event.target.value;
        this.setState({
            type: selectedValue,
            append: '',
            lookup: '',
            replace: '',
            lookupRegExp: '',
            replaceRegExp: '',
            enablePreviewButton: false,
            enabledRenameButton: false
        });
        // console.log('type: ', selectedValue);

        this.validateCanPreview();
    }

    onAppendChanged(event) {
        let changedValue = event.target.value;
        this.setState({ append: changedValue });
        // console.log('append:', changedValue);

        this.validateCanPreview();
    }

    onLookupChanged(event) {
        let changedValue = event.target.value;
        this.setState({ lookup: changedValue });
        // console.log('lookup:', changedValue);
        this.validateCanPreview();
    }

    onReplaceChanged(event) {
        let changedValue = event.target.value;
        this.setState({ replace: changedValue });
        //console.log('replace:', changedValue);
        //this.validateCanPreview();
    }

    onLookupRegExpChanged(event) {
        let changedValue = event.target.value;

        this.setState({ lookupRegExp: changedValue });

        this.validateCanPreview();
    }

    onReplaceRegExpChanged(event) {
        let changedValue = event.target.value;

        this.setState({ replaceRegExp: changedValue });
    }

    onPreviewClick(event) {
        this.applyRename();

        this.setState({ enabledRenameButton: true });
    }

    onRenameClick(event) {
        const { renamedFiles } = this.state;

        ipcRenderer.send('rename-files', renamedFiles);

        this.setState({ enabledRenameButton: false });
    }

    applyRename() {
        const {
            files,
            type,
            append,
            lookup,
            replace,
            lookupRegExp,
            replaceRegExp
        } = this.state;

        let renamedFiles = files.map((v, i) => {
            let name = '';
            let obj = {
                name: v.name,
                extension: v.extension,
                directoryName: v.directoryName,
                fullPath: v.fullPath,
                error: null,
                hasError: false,
                renamed: false
            };

            if (type === '1') {
                obj.name = obj.name.replace(lookup, replace);
            }
            if (type === '2') {
                obj.name = `${append}${obj.name}`;
            }
            if (type === '3') {
                obj.name = `${obj.name}${append}`;
            }
            if (type === '4') {
                // 정규식
                let regExp = new RegExp(lookupRegExp, 'gi');
                obj.name = obj.name.replace(regExp, replaceRegExp);
            }

            return obj;
        });

        console.log('renamed files: ', renamedFiles);

        this.setState({ renamedFiles: renamedFiles });
    }

    validateCanPreview() {
        const { enablePreviewButton } = this.state;
        var valid = this.enablePreviewButton();
        if (enablePreviewButton !== valid) {
            this.setState({
                enablePreviewButton: valid
            });
        }
    }

    enablePreviewButton() {
        const { files, type, append, lookup, lookupRegExp } = this.state;

        if (files == null || files.length < 1) {
            return false;
        }

        if (type === '1') {
            if (lookup && lookup.length > 0) {
                return true;
            }
        }

        if (type === '2') {
            if (append && append.length > 0) {
                return true;
            }
        }

        if (type === '3') {
            if (append && append.length > 0) {
                return true;
            }
        }

        if (type === '4') {
            if (lookupRegExp && lookupRegExp.length > 0) {
                return true;
            }
        }

        return false;
    }

    render() {
        const {
            files,
            renamedFiles,
            type,
            append,
            lookup,
            replace,
            lookupRegExp,
            replaceRegExp,
            enablePreviewButton,
            enabledRenameButton
        } = this.state;
        return (
            <div>
                <div>
                    <FileInput />
                </div>
                <hr />
                <div className='row'>
                    <div className='col-4'>
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
                                value={type}
                                onChange={this.onTypeChanged}
                            >
                                {this.types.map((v, i) => {
                                    return (
                                        <option key={v.key} value={v.key}>
                                            {v.value}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className='col-8'>
                        {type === '2' || type === '3' ? (
                            <div className='form-group'>
                                <label className='control-label'>
                                    추가할 문자열
                                </label>
                                <input
                                    value={append}
                                    onChange={this.onAppendChanged}
                                    type='text'
                                    className='form-control'
                                />
                            </div>
                        ) : null}
                        {type === '1' ? (
                            <div className='row'>
                                <div className='col-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>
                                            찾는 문자열
                                        </label>
                                        <input
                                            value={lookup}
                                            onChange={this.onLookupChanged}
                                            type='text'
                                            className='form-control'
                                        />
                                    </div>
                                </div>
                                <div className='col-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>
                                            변경할 문자열
                                        </label>
                                        <input
                                            value={replace}
                                            onChange={this.onReplaceChanged}
                                            type='text'
                                            className='form-control'
                                        />
                                    </div>
                                </div>
                                <small className='form-text text-muted'>
                                    첫번째 발견된 문자열만 변경됩니다.
                                </small>
                            </div>
                        ) : null}

                        {type === '4' ? (
                            <div className='row'>
                                <div className='col-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>
                                            찾는 정규식
                                        </label>
                                        <input
                                            value={lookupRegExp}
                                            onChange={
                                                this.onLookupRegExpChanged
                                            }
                                            type='text'
                                            className='form-control'
                                        />
                                    </div>
                                </div>
                                <div className='col-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>
                                            변경할 문자열
                                        </label>
                                        <input
                                            value={replaceRegExp}
                                            onChange={
                                                this.onReplaceRegExpChanged
                                            }
                                            type='text'
                                            className='form-control'
                                        />
                                    </div>
                                </div>
                                <small className='form-text text-muted'>
                                    발견된 모든 문자열이 변경됩니다.
                                </small>
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className='row'>
                    <div className='col-3'>
                        <div
                            className='btn-group'
                            role='group'
                            aria-label='buttons'
                        >
                            <button
                                type='button'
                                className='btn btn-warning btn-sm align-bottom'
                                disabled={!enablePreviewButton}
                                onClick={this.onPreviewClick}
                            >
                                Preview
                            </button>
                            <button
                                type='button'
                                className='btn btn-primary btn-sm align-bottom'
                                disabled={!enabledRenameButton}
                                onClick={this.onRenameClick}
                            >
                                Rename
                            </button>
                        </div>
                    </div>
                </div>
                <hr />
                <div className='row'>
                    <div className='col-6'>
                        <h3>Before</h3>
                        <List files={files} />
                    </div>
                    <div className='col-6'>
                        <h3>After</h3>
                        <List files={renamedFiles} />
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = RenameApp;
