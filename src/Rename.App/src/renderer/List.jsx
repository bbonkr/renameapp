const React = require("react");

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
                    return (
                        <li className='list-group-item' key={i}>
                            {v.name}
                            {v.extention}
                        </li>
                    );
                })}
            </ul>
        );
    }
}

module.exports = List;
