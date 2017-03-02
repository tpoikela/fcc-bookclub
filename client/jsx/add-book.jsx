'use strict';

const React = require('react');


class AddBook extends React.Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onClickAdd = this.onClickAdd.bind(this);
		this.state = {
			bookName: ''
		};
    }

    onChange(e) {
		var bookName = e.target.value;
		this.setState({bookName: bookName});
    }

	onClickAdd() {
		this.props.onClickAdd(this.state.bookName);
	}

    render() {
        return (
            <div className='add-book'>
				<input className='fa fa-2x search-input'
                    name='book-name'
                    onChange={this.onChange}
                    placeholder='What books have you?'
                    value={this.state.bookName}
				/>
                <button id='add-button' onClick={this.onClickAdd}>
                    <i className='search-icon fa fa-search fa-2x'/>
                </button>

            </div>

        );
    }

}

AddBook.propTypes = {
	onClickAdd: React.PropTypes.func
};

module.exports = AddBook;
