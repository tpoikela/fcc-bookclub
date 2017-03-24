'use strict';

const React = require('react');

class Button extends React.Component {

    render() {
        return (
            <button
                className='books-btn'
                onClick={this.props.onClick}
                >
                {this.props.title}
            </button>
        );

    }

}

Button.propTypes = {
    onClick: React.PropTypes.func,
    title: React.PropTypes.string
};

module.exports = Button;
