import { ipcRenderer } from 'electron';
import React from 'react';
import jquery from 'react';
import bootstrap from 'bootstrap';
import FileInput from './FileInput.jsx';
import List from './List.jsx';
import { withAlert } from 'react-alert';

class RenameApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            renamedFiles: [],
            type: '1',
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

        ipcRenderer.on('renameFiles-callback', (ev, args) => {
            let renamedResults = args.map((v, i) => {
                return {
                    name: v.name,
                    extension: v.extension,
                    directoryName: v.directoryName,
                    fullPath: v.fullPath,
                    error: v.error,
                    hasError: v.hasError,
                    renamed: v.renamed
                };
            });

            this.setState({
                files: renamedResults,
                renamedFiles: [],
                append: '',
                lookup: '',
                replace: '',
                lookupRegExp: '',
                replaceRegExp: '',
                enablePreviewButton: false,
                enabledRenameButton: false
            });

            this.props.alert.show('Renamed!');
        });
    }

    onTypeChanged(event) {
        const { type } = this.state;

        let selectedValue = event.target.value;
        if (type !== selectedValue) {
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
        }

        this.validateCanPreview();
    }

    onAppendChanged(event) {
        const { append } = this.state;
        let changedValue = event.target.value;
        if (append !== changedValue) {
            this.setState({ append: changedValue });
        }
        this.validateCanPreview();
    }

    onLookupChanged(event) {
        const { lookup } = this.state;
        let changedValue = event.target.value;
        if (changedValue !== lookup) {
            this.setState({ lookup: changedValue });
        }
        this.validateCanPreview();
    }

    onReplaceChanged(event) {
        const { replace } = this.state;
        let changedValue = event.target.value;
        if (replace !== changedValue) {
            this.setState({ replace: changedValue });
        }
    }

    onLookupRegExpChanged(event) {
        const { lookupRegExp } = this.state;
        let changedValue = event.target.value;
        if (lookupRegExp !== changedValue) {
            this.setState({ lookupRegExp: changedValue });
        }
        this.validateCanPreview();
    }

    onReplaceRegExpChanged(event) {
        const { replaceRegExp } = this.state;
        let changedValue = event.target.value;
        if (replaceRegExp !== changedValue) {
            this.setState({ replaceRegExp: changedValue });
        }
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
                console.log('name: ', obj.name, obj.name);
                console.log('lookup: ', lookup);
                console.log('replace: ', replace);

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
                <div className='row'>
                    <div className='col-12'>
                        <FileInput />
                    </div>
                </div>
                <hr />
                <div className='row'>
                    <div className='col-3'>
                        <div className='form-group'>
                            <label
                                htmlFor='selectOperationType'
                                className='control-label'
                            >
                                방법
                            </label>
                            <select
                                id='selectOperationType'
                                className='form-control form-control-sm'
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
                    <div className='col-9'>
                        {type === '2' || type === '3' ? (
                            <div className='form-group'>
                                <label className='control-label'>
                                    추가할 문자열
                                </label>
                                <input
                                    value={append}
                                    onChange={this.onAppendChanged}
                                    type='text'
                                    className='form-control form-control-sm'
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
                                            className='form-control form-control-sm'
                                            placeholder='찾는 문자열'
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
                                            className='form-control form-control-sm'
                                            placeholder='변경할 문자열'
                                        />
                                        <small className='form-text text-muted'>
                                            첫번째 발견된 문자열만 변경됩니다.
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {type === '4' ? (
                            <div className='row'>
                                <div className='col-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>
                                            찾는 정규식
                                        </label>
                                        <div className='input-group input-group-sm'>
                                            <div className='input-group-prepend'>
                                                <span className='input-group-text'>
                                                    /
                                                </span>
                                            </div>
                                            <input
                                                value={lookupRegExp}
                                                onChange={
                                                    this.onLookupRegExpChanged
                                                }
                                                type='text'
                                                className='form-control form-control-sm'
                                                placeholder='정규식'
                                            />
                                            <div className='input-group-append'>
                                                <span className='input-group-text'>
                                                    /gi
                                                </span>
                                            </div>
                                        </div>
                                        <small className='form-text text-muted'>
                                            발견된 모든 문자열이 변경됩니다.
                                        </small>
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
                                            className='form-control form-control-sm'
                                        />
                                    </div>
                                </div>
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

export default withAlert(RenameApp);
