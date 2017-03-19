'use strict';

var React = require('react');

const activeClass = 'tab-sel-active';
const inActiveClass = 'tab-sel-inactive';

class TabSelect extends React.Component {

    render() {
        var tabs = this.props.tabs;

        var showProfile = tabs.showProfile ? activeClass : inActiveClass;
        var showAddBooks = tabs.showAddBooks ? activeClass : inActiveClass;
        var showContactInfo = tabs.showContactInfo ? activeClass
            : inActiveClass;

        return (
        <div id='select-panel'>
            <button className={showProfile}
                onClick={this.props.onClickShowProfile}
                >
                Profile
            </button>
            <button className={showAddBooks}
                onClick={this.props.onClickShowAddBooks}
                >
                Add books
            </button>
            <button className={showContactInfo}
                onClick={this.props.onClickShowContactInfo}
                >
                Contact details
            </button>
        </div>
        );
    }

}

TabSelect.propTypes = {
    onClickShowProfile: React.PropTypes.func,
    onClickShowAddBooks: React.PropTypes.func,
    onClickShowContactInfo: React.PropTypes.func,
    tabs: React.PropTypes.object
};

module.exports = TabSelect;
