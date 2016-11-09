import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { default as config } from 'config';
import { actions } from 'redux/modules/siteReducer';
import { actions as widgetActions } from 'redux/modules/widgetReducer';


class RefreshButton extends Component {

  refreshClick(event) {
    let {widgetName} = this.props;
    event.preventDefault();
    this.props.widgetActions.widgetLoading(widgetName);
    // Aggregate widget
    console.log(config.mode);
    this.props.actions.siteAggAll(config.mode, [widgetName.toLowerCase()]).then(() => {
      // Reload widget data
      this.props.widgetActions.widgetLoadData(
        widgetName,
        this.props.widgetQuery.url, 
        this.props.widgetQuery.process
      )
    });
  }

  render() {
    if(config.mode === 'local' || config.mode === 'remote') {
      return (
        <a className="refresh-button" href="#" onClick={this.refreshClick.bind(this)}><i className="fa fa-refresh"></i><span className="sr-only">Refresh</span></a>
      )
    }
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
