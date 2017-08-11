import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { default as config } from 'config';
import { actions } from 'redux/modules/siteReducer';
import { actions as widgetActions } from 'redux/modules/widgetReducer';
import { stackDef } from 'views/WidgetList/widgets/Stack/Stack';
import { pluginsDef } from 'views/WidgetList/widgets/Plugins/Plugins';

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

    console.log(stackDef);

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
      return (
        <a className="refresh-button" href="#" onClick={this.refreshClick.bind(this)}><i className="fa fa-refresh"></i><span className="sr-only">Refresh</span></a>
      )
    // }
    return <span></span>
  }
}

RefreshButton.propTypes = {
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
