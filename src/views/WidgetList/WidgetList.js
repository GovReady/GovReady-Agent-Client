import React, { Component, PropTypes as PT } from 'react';
import widgets from './widgets';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { default as config } from 'config';
import { actions } from '../../redux/modules/siteReducer';

class WidgetsListPage extends Component {
  render () {

    // Simple render function from widgetName
    const renderWidget = (name, params = {}) => {
      params.widgetName = name;
      params.display = 'widget';
      return React.createElement(widgets[name].component, params);
    }

    let {siteState} = this.props;

    // We aren't loaded
    if(!config.siteId || !siteState.currentSite) {
      return (
        <div className='loading'>
          <i className='fa fa-spinner fa-2x fa-spin'></i><span className='sr-only'>Loading</span>
        </div>
      )
    }

    // We don't have application data for widgets
    // so render as agent
    if(!siteState.currentSite.application) {
      return(
        <div className='widget-layout'>
          <div className='row row-first'>
            <div className='col-sm-12'>
              {renderWidget('Measures')}
            </div>
            <div className='col-sm-12'>
              {renderWidget('Contacts')}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className='widget-layout'>
        <div className='row row-first'>
          <div className='col-sm-4'>
            {renderWidget('Plugins')}
          </div>
          <div className='col-sm-4'>
            {renderWidget('Domains')}
          </div>
          <div className='col-sm-4'>
            {renderWidget('Accounts', {widgetType: 'default'})}
          </div>
        </div>
        <div className='row row-seco'>
          <div className='col-sm-6'>
            {renderWidget('Stack')}
          </div>
          <div className='col-sm-6'>
            {renderWidget('CmsVulnerabilities')}
          </div>
        </div>
        <div className='row row-third'>
          <div className='col-sm-12'>
            {renderWidget('Measures')}
          </div>
        </div>
        <div className='row row-fourth'>
          <div className='col-sm-12'>
            {renderWidget('Accounts', {widgetType: 'inactive'})}
          </div>
          <div className='col-sm-12'>
            {renderWidget('Contacts')}
          </div>
        </div>
      </div>
    );
  }
}

// Hooked up to multiple reducers, so dont use stock Widget methods

function mapStateToProps (state, ownProps) {
  return {
    siteState: state.siteState
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetsListPage);
