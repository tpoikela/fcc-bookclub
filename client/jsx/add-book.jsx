'use strict';

const React = require('react');

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

	onClickAdd(book) {
		this.props.onClickAdd(book);
	}

	onClickSearch() {
		this.props.onClickSearch(this.state.bookName);
	}

    render() {

        // Generate the search results here
        var searchResults = this.props.searchResults.map( (item, index) => {
            var addCallback = this.onClickAdd.bind(this, item);
            var volInfo = item.volumeInfo;
            console.log('volInfo: ' + JSON.stringify(volInfo));

            var thumbnail = null;
            if (volInfo.imageLinks) {
                if (volInfo.imageLinks.smallThumbnail) {
                    thumbnail = <img src={volInfo.imageLinks.smallThumbnail}/>;
                }
            }
            else {
                console.log('No imageLinks for volInfo');

            }

            return (
                <div className='book-item' key={index} >
                    {thumbnail}
                    Title: {volInfo.title}
                    Year: {volInfo.publishedData}
                    Pages: {volInfo.pageCount}
                    <button onClick={addCallback}>Add to Profile</button>
                </div>

            );
        });

        return (
            <div className='add-book'>
				<input className='fa fa-2x search-input'
                    name='book-name'
                    onChange={this.onChange}
                    placeholder='What books have you?'
                    value={this.state.bookName}
				/>
                <button id='add-button' onClick={this.onClickSearch}>
                    <i className='search-icon fa fa-search fa-2x'/>
                </button>
                {searchResults}
            </div>

        );
    }

}

AddBook.propTypes = {
	onClickAdd: React.PropTypes.func,
    onClickSearch: React.PropTypes.func,
    searchResults: React.PropTypes.array
};

module.exports = AddBook;
