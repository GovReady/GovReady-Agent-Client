import React, { Component } from 'react';
import config from 'config/';
import Widget from '../Widget';
import AccountsWidget from './AccountsWidget';
import RefreshButton from 'components/RefreshButton';
import InactiveAccountsWidget from './InactiveAccountsWidget';
import { Link } from 'react-router';
import PanelLoading from 'components/loading/Panel';
import TableLoading from 'components/loading/VerticalTable';

class Accounts extends Component {

  static defaultProps = {
    widget: {},
    widgetQuery: {
      url: 'accounts',
      process: (data) => {
        return {
          lastStatus: data.lastStatus,
          accounts: data.accounts.map((user) => {
            if (!user.lastLogin) {
              return user;
            }
            let loginInt = parseInt(user.lastLogin);
            // string   
            if (isNaN(loginInt)) {
              user.lastLogin = false;
              return user;
            }
            // php timestamp convert
            let lastLogin = window.moment(loginInt * 1000);
            if (!lastLogin || !lastLogin._isAMomentObject) {
              user.lastLogin = false;
              return user; 
            }
            user.lastLogin = lastLogin.format('MMMM Do YYYY, h:mm:ss a');
            return user;
          })
        };
      }
    }
  }

  componentWillMount () {
    Widget.registerWidget(
      this, 
      true
    );
  }

  // Returns accounts filtered by if they have lastLogin or not
  getInactiveAccounts() {
    return this.props.widget.data.accounts.filter((user) => {
      if( !user.lastLogin ) {
        return false;
      }      
      const lastLogin = window.moment(user.lastLogin, 'MMMM Do YYYY, h:mm:ss a');
      const days = window.moment().diff(lastLogin, 'days');
      return days && days % 1 === 0 && days > 30 && days < 10000;
    });
  }

  render () {
    let { widget, widgetType }  = this.props;

    if(window.loadShow) { 
      if (widgetType === 'inactive') {
        return <TableLoading text={true} colCount={1} />;
      } else  {
        return <PanelLoading />;
      }
    }
      

    // Return loading if not set
    if(!widget.status || widget.status !== 'loaded') {
      if (widgetType === 'inactive') {
        return <TableLoading text={true} colCount={1} />;
      } else  {
        return <PanelLoading />;
      }
    }

    let userUrl, adminRole;
    // CMS Specific
    switch(config.cms) {  
      case 'wordpress':
        adminRole = 'administrator';
        userUrl = config.siteUrl + '/wp-admin/users.php';
        break;
      case 'drupal':
        adminRole = 'administrator'; 
        userUrl = config.siteUrl + '/admin/people';
        break;
    }



    // Inactive
    if(widgetType === 'inactive') {
      return (
        <InactiveAccountsWidget
          userUrl={userUrl} 
          refreshButton={(<RefreshButton status={widget.data.lastStatus} widgetName={this.props.widgetName} widgetQuery={this.props.widgetQuery} />)}
          accounts={this.getInactiveAccounts()} />
      )
    }
    // Normal accounts widget
    else {
      
      let admins = 0;
      let totalAccounts = 0;
      // Compile data
      if (widget.data && widget.data.accounts && widget.data.accounts.length) {
        widget.data.accounts.map((account) => {
          if (account.superAdmin) {
            admins++;
          }
        });
        totalAccounts = widget.data.accounts.length;
      }

      // @TODO?
      if(this.props.display === 'page') {
        return (
          <div>AccountsPage</div>
        )
      }
      else {
        return (
          <AccountsWidget
            admins={admins}
            totalAccounts={totalAccounts} 
            refreshButton={(<RefreshButton status={widget.data.lastStatus} widgetName={this.props.widgetName} widgetQuery={this.props.widgetQuery} />)}
            footer={Widget.panelFooter(totalAccounts + ' total accounts', userUrl, true)} />
        )
      }
    }
  }
}

Accounts.propTypes = Widget.propTypes();

export default Widget.connect(Accounts);
