import React, { Component, PropTypes as PT } from 'react';
import { default as config } from 'config';
import Widget from '../Widget';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import objectAssign from 'object-assign';
import { Link } from 'react-router';
import { actions } from 'redux/modules/widgetReducer';
import { actions as crudActions } from 'redux/modules/contactsReducer';
import { actions as messageActions } from 'redux/modules/messageReducer';
import {isoToDate, dateToIso} from 'utils/date';
import ContactsWidget from './ContactsWidget';
import ContactsEditPage from './ContactsEditPage';
import TableLoading from 'components/loading/VerticalTable';


class Contacts extends Component {

  static defaultProps = {
    widget: {},
    submitFields: [
      'name',
      'email',
      'responsibility',
      'phone',
      'lastConfirmed'
    ]
  }

  componentWillMount () {
    Widget.registerWidget(
      this, 
      false
    );
    if (this.props.widget.status !== 'loaded') {
      this.props.crudActions
        .fetchRemote(config.apiUrl + 'contacts')
        .then(() => Widget.loadComplete(this))
        .catch((e) => Widget.loadComplete(this, e));
    }
  }

  emptyText(includeLink) {
    return (
      <div className="alert alert-warning">
        <span>No contact information completed. Please </span>
        {includeLink && (
          <Link to='/dashboard/Contacts'>add some!</Link>
        )}
        {!includeLink && (
          <span>add some!</span>
        )}
      </div>
    );
  }

  handleSubmit(data) {
    let { widget, submitFields, crudActions } = this.props
    const assignProps = (toSet, setData) => {
      submitFields.map((field) => {
        if(setData[field] || setData[field] === false) {
          toSet[field] = setData[field];
        }
      });
      return toSet;
    }

    if(widget && widget.status !== 'posting') {
      let calls = [];
      let alerted = false;
      // Fire message
      const finishSubmit = () => {
        if(alerted) {
          return;
        }
        alerted = true;
        // Set a message
        this.props.messageActions.messageAdd({
          level: 'success',
          content: 'Contacts have been updated.'
        });
      }
      data.contacts.map((contact, index) => {
        // Convert to server time format
        contact.lastConfirmed = dateToIso(contact.lastConfirmed);
        // Existing record
        if(contact._id) {
          crudActions.updateRemote(config.apiUrl + 'contacts/' + contact._id, contact)
            .then(finishSubmit());
        } 
        // New item
        else {
          crudActions.createRemote(config.apiUrl + 'contacts', assignProps({}, contact))
            .then(finishSubmit());
        }
      });
    }
    
  }

  contactsDelete(contact) {
    // Launch all actions
    if(contact._id && contact._id.value) {
      this.props.crudActions.deleteRemote(config.apiUrl + 'contacts/' + contact._id.value, contact);
    }
    else {
      //error
    }
  }

  render () {

    let { widget, contacts, display, widgetName } = this.props;

    if(window.loadShow) { 
      return <TableLoading text={true} colCount={1} />;
    }

    // Return loading if not set
    if (!widget.status || (widget.status !== 'loaded' && display !== 'page')) {
      return <TableLoading text={true} colCount={1} />;
    }

    if(display === 'page') {
      return (
        <ContactsEditPage 
          contactsData={contacts}
          contactsSubmit={this.handleSubmit.bind(this)}
          contactsDelete={this.contactsDelete.bind(this)}
          emptyText={this.emptyText()} />
      )
    }
    else {
      return (
        <ContactsWidget 
          headerLink={<Link to='/dashboard/Contacts'>Points of Contact to Maintain your Site</Link>} 
          contacts={contacts}
          emptyText={this.emptyText(true)} />
      )
    }
  }
}

Contacts.propTypes = Widget.propTypes({
  submitFields: PT.array
});

// Hooked up to multiple reducers, so dont use stock Widget methods
function mapStateToProps (state, ownProps) {
  return {
    widget: state.widgetState.widgets[ownProps.widgetName],
    contacts: state.contactsState
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    crudActions: bindActionCreators(crudActions, dispatch),
    messageActions:  bindActionCreators(messageActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Contacts);
