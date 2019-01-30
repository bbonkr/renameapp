import React from 'react';

class List extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {}

    render() {
        const { files } = this.props;

        return (
            <ul className='list-group'>
                {files.map((v, i) => {
                    let liClasses =
                        'list-group-item list-group-item-action d-flex justify-content-between align-items-center';

                    if (v.hasError) {
                        liClasses += ' list-group-item-danger';
                    } else if (v.renamed) {
                        liClasses += ' list-group-item-success';
                    }

                    return (
                        <li
                            className={liClasses}
                            key={v.fullPath}
                            title={v.fullPath}
                        >
                            <div>
                                <div>
                                    {v.name}
                                    {v.extension}
                                </div>
                                <div>
                                    <small className='text-muted'>
                                        {v.directoryName}
                                    </small>
                                </div>

                                {v.hasError ? (
                                    <div>
                                        <h4>Error:</h4>
                                        <p>{v.error}</p>
                                    </div>
                                ) : null}
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

export default List;
