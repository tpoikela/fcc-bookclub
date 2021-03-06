'use strict';

const React = require('react');
const BookItem = require('./book-item');
const Button = require('./button');

/* Component to add and search for books to be added to the profile.*/
class AddBook extends React.Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onClickAdd = this.onClickAdd.bind(this);
        this.onClickSearch = this.onClickSearch.bind(this);
		this.state = {
			bookName: ''
		};
    }

    onChange(e) {
		var bookName = e.target.value;
		this.setState({bookName: bookName});
    }

	onClickAdd(book, index) {
		this.props.onClickAdd(book, index);
	}

	onClickSearch() {
		this.props.onClickSearch(this.state.bookName);
	}

    render() {

        // Generate the search results here
        var searchResults = this.props.searchResults.map( (book, index) => {
            var addCallback = this.onClickAdd.bind(this, book, index);

            var btnOrMsg = null;
            if (book.added) {
                btnOrMsg = <p className='text-success'>Added to profile.</p>;
            }
            else {
                btnOrMsg = (
                    <Button onClick={addCallback}
                        title={'Add to Profile'}
                    />
                );
            }

            return (
                <div className='add-book-item' key={index} >
                    <BookItem book={book} className='book-item' />
                    {btnOrMsg}
                </div>

            );
        });

        // Render either search button or spinner (if search in progress)
        var buttonOrSpinner = null;
        if (this.props.waitingSearch) {
            buttonOrSpinner = (<div className='wait-search-icon'>
                <i className='fa fa-spin fa-spinner fa-2x '/>
            </div>);
        }
        else {
            buttonOrSpinner = (
                <button
                    className='books-btn'
                    id='add-button'
                    onClick={this.onClickSearch}
                    >
                    <i className='search-icon fa fa-search fa-2x'/>
                </button>
            );
        }

        return (
            <div className='add-book'>
				<input className='fa fa-2x search-input'
                    name='book-name'
                    onChange={this.onChange}
                    placeholder='What books have you?'
                    value={this.state.bookName}
				/>
                {buttonOrSpinner}
                {searchResults}
            </div>

        );
    }

}

AddBook.propTypes = {
	onClickAdd: React.PropTypes.func,
    onClickSearch: React.PropTypes.func,
    searchResults: React.PropTypes.array,
    waitingSearch: React.PropTypes.bool
};

module.exports = AddBook;
