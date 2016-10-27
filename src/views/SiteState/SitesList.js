import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { default as config } from 'config';
import { actions as widgetActions } from '../../redux/modules/widgetReducer';
import { 
  actions,
  SITE_LOADED 
} from '../../redux/modules/siteReducer';

class SitesList extends Component {
  componentWillMount () {
    let { siteState } = this.props; 
  }

  viewClick(event, site) {
    event.preventDefault();
    this.props.widgetActions.widgetClearData();
    this.props.actions.siteChangeSite(site.siteId);
  }

  render () {
    let { siteState } = this.props;
    if (siteState.status !== SITE_LOADED || !siteState.sites || !siteState.sites.length ) {
      return (
        <div></div>
      );
    }

    return (
      <div className="sites-list"><div className="list-group">
        {siteState.sites.map((site, key) => (
          <div key={key} className="list-group-item">
            <h4 className="list-group-item-heading">{site.title}</h4>
            <p><a href={site.url} target="_blank"><i className="fa fa-share"></i> {site.url}</a></p>
            <a href="#" onClick={(event)=>this.viewClick(event, site)} className="btn btn-primary">View</a>
            <a href="#" className="btn btn-default">Edit</a>
          </div>
        ))}
      </div></div>
    );
  }
}

SitesList.propTypes = {
  actions: PT.object.isRequired,
  siteState: PT.object.isRequired
};

function mapStateToProps (state) {
  return {
    siteState: state.siteState
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    widgetActions: bindActionCreators(widgetActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SitesList);
