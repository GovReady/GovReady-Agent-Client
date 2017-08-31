import React, { Component } from 'react';
import { PropTypes as PT } from 'prop-types';

class InactiveAccountsWidget extends Component {

  listUsersTable (users) {
    // None
    if(!users || !users.length) {
      return (
        <div className="alert alert-info">
          <p>No inactive accounts</p>
        </div>
      )
    }
    // Joins roles
    const printRoles = (user) => {
      if(user.roles && user.roles.length) {
        return user.roles.join(', ');
      }
    }
    return (
      <div className='table-responsive'>
        <table className='table'>
          <thead>
            <tr>
              <th>
                User
              </th>
              <th>
                Roles
              </th>
              <th>
                Last Login
              </th>
            </tr>
          </thead>
          <tbody>
           {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.name}</td>
                <td>{printRoles(user)}</td>
                <td>{user.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  render () {
    return (
      <div className='widget account-widget'>
        <div>
          {this.props.refreshButton}
          <div className="title">
            <h3><a target="_blank" href={this.props.userUrl}>Inactive Accounts</a></h3>
          </div>
          <h5>
            Are these users still in your organization?  <a target="_blank" href={this.props.userUrl}>Edit them</a>.  
            If not, <a target="_blank" href={this.props.userUrl}>delete them</a>.
          </h5>
          {this.listUsersTable(this.props.accounts)}
        </div>
      </div>
    );
  }
}

InactiveAccountsWidget.propTypes = {
  userUrl: PT.string,
  accounts: PT.array.isRequired
};

export default InactiveAccountsWidget;
