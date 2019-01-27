const React = require('react');

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
                    let liClasses = 'list-group-item';

                    if (v.hasError) {
                        liClasses += ' list-group-item-danger';
                    } else if (v.renamed) {
                        liClasses += ' list-group-item-success';
                    }

                    return (
                        <li className={liClasses} key={v.fullPath}>
                            <div>
                                {v.name}
                                {v.extension}
                            </div>
                            <div>
                                <small>{v.directoryName}</small>
                            </div>
                            {v.hasError ? (
                                <div>
                                    <h4>Error:</h4>
                                    <p>{v.error}</p>
                                </div>
                            ) : null}
                        </li>
                    );
                })}
            </ul>
        );
    }
}

module.exports = List;
