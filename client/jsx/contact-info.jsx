'use strict';

var React = require('react');
const ContactInput = require('./contact-input');

class ContactInfo extends React.Component {

    constructor(props) {
        super(props);

        // Use this array to specify the different inputs
        this.inputs = [
            ['userEmail', 'Email', 'Enter your email', 'email'],
            ['userFullname', 'Full name', 'Enter your full name', 'text'],
            ['userAddress', 'Address', 'Enter your address', 'text'],
            ['userPostCode', 'Post code', 'Enter your post code', 'text'],
            ['userState', 'State', 'Enter your state', 'text']
        ];

        this.onClickUpdate = this.onClickUpdate.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onClickUpdate() {
        this.props.onClickUpdate();
    }

    onChange(id, e) {
        console.log('<ContactInfo> onChange id ' + id);
        this.props.onChange(id, e);
    }

    render() {
        var inputs = this.createInputElems();

        return (
            <div className='form'>
              {inputs}
              <button className='btn btn-default'
                  onClick={this.onClickUpdate}
                  >Update
              </button>
          </div>

        );

    }

    /* Creates the input elements based on this.inputs. */
    createInputElems() {
        var inputs = this.inputs.map( (item, index) => {

            var id = item[0];
            var label = item[1];
            var descr = item[2];
            var type = item[3];

            var storedValue = '';
            if (this.props[id]) {
                storedValue = this.props[id];
            }

            return (
                <ContactInput id={id} key={index} label={label}
                    onChange={this.onChange}
                    placeholder={descr}
                    storedValue={storedValue}
                    type={type}
                />
            );
        });
        return inputs;
    }

}

ContactInfo.propTypes = {
    onChange: React.PropTypes.func,
    onClickUpdate: React.PropTypes.func
};


module.exports = ContactInfo;
