'use strict';
var React = require('react');

/* Customisable input component used in contact info form.*/
class ContactInput extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.props.onChange(this.props.id, e);
    }

    render() {
        var id = this.props.id;
        var label = this.props.label;
        var placeholder = this.props.placeholder;
        var type = 'text';
        if (this.props.type) {
            type = this.props.type;
        }

        var storedValue = this.props.storedValue;

        return (
            <div className='books-form-group form-group'>
                <span>Stored value: {storedValue}<br/></span>
                <label htmlFor={id}>{label}</label>
                <input className='books-contact-input form-control'
                    id={id}
                    onChange={this.onChange}
                    placeholder={placeholder}
                    type={type}
                />
            </div>
        );

    }

}

ContactInput.propTypes = {
    id: React.PropTypes.string,
    label: React.PropTypes.string,
    onChange: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    storedValue: React.PropTypes.string,
    type: React.PropTypes.string
};

module.exports = ContactInput;
