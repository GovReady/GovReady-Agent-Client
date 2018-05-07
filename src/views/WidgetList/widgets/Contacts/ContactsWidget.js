import React, { Component } from 'react';
import { PropTypes as PT } from 'prop-types';
import {isoToDate} from 'utils/date';

class ContactsWidget extends Component {

  listContactsTable (contacts = [], emptyText) {
    if (contacts && contacts.length) {
      return (
        <div className='table-responsive'>
          <table className='table contacts-list'>
            <thead>
              <tr>
                <th>
                  What to call them for
                </th>
                <th>
                  Email
                </th>
                <th>
                  Phone
                </th>
                <th>
                  Last Confirmed
                </th>
              </tr>
            </thead>
            <tbody>
             {contacts.map((contact, index) => (
                <tr key={index}>
                  <td>{contact.responsibility}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.lastConfirmed ? isoToDate(contact.lastConfirmed) : "Never"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return emptyText;
  }

  render () {
    return (
      <div>
        <div className="title">
          <h3>{this.props.headerLink}</h3>
        </div>
        <h5>Keep this handy list  with important contacts to maintain your site</h5>
        {this.listContactsTable(this.props.contacts, this.props.emptyText)}
        {this.props.footer}
      </div>
    );
  }
}

ContactsWidget.propTypes = {
  headerLink: PT.object,
  contacts: PT.array.isRequired,
  emptyText: PT.object.isRequired,
  footer: PT.object
};

export default ContactsWidget;
