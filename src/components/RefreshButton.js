import React, { Component } from 'react';
import { PropTypes as PT } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { default as config } from 'config';
import { actions } from 'redux/modules/siteReducer';
import { actions as widgetActions } from 'redux/modules/widgetReducer';
import { stackDef } from 'views/WidgetList/widgets/Stack/Stack';
import { pluginsDef } from 'views/WidgetList/widgets/Plugins/Plugins';
import { isoToDate } from 'utils/date';

class RefreshButton extends Component {

  refreshClick(event) {
    event.preventDefault();
    let {widgetName, widgetQuery, actions, widgetActions} = this.props;
    widgetActions.widgetLoading(widgetName);

    const callBoth = widgetName === 'Stack' || widgetName === 'Plugins';

    // Plugins needs stack to be called first
    const calls = callBoth 
                ? ['stack', 'plugins'] 
                : [widgetName.toLowerCase()];
    
    // Aggregate widget
    actions.siteAggAll(config.mode, calls).then(() => {
      // Plugins needs stack to be loaded
      if (callBoth) {
        // Reload stack data
        widgetActions.widgetLoadData(
          'Stack',
          stackDef.widgetQuery.url,
          stackDef.widgetQuery.process
        );
        // Reload plugin data
        widgetActions.widgetLoadData(
          'Plugins',
          pluginsDef.widgetQuery.url,
          pluginsDef.widgetQuery.process
        );
      } else {
        // Reload widget data
        widgetActions.widgetLoadData(
          widgetName,
          widgetQuery.url, 
          widgetQuery.process
        );
      }
    });
  }

  render() {
    // if(config.mode === 'local' || config.mode === 'remote') {
      const { status } = this.props;
      let lastRefreshed = null;
      if (status) {
        // Last status had an error
        if (!status.status) {
          lastRefreshed = (
            <span className="has-error"><i className="fa fa-exclamation-circle"></i> failed</span>
          );
        } else if (status.datetime) {
          lastRefreshed = (
            <span><i className="fa fa-check-circle"></i> {isoToDate(status.datetime, 'l')}</span>
          );
        }
      }
      return (
        <div className="refresh-button">
          {lastRefreshed && (
            <h5 className="last-refreshed">{lastRefreshed}</h5>
          )}
          <a href="#" onClick={this.refreshClick.bind(this)}><i className="fa fa-refresh"></i><span className="sr-only">Refresh</span></a>
        </div>
      );
    // }
    return <span></span>;
  }
}

RefreshButton.propTypes = {
  status: PT.object,
  widgetName: PT.string.isRequired,
  widgetQuery: PT.object.isRequired
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    widgetActions: bindActionCreators(widgetActions, dispatch)
  };
}

export default connect(
  null,
  mapDispatchToProps
)(RefreshButton);
