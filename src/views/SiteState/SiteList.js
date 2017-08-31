import React, { Component } from 'react';
import { PropTypes as PT } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { default as config } from 'config';
import { 
  actions,
  SITE_LOADED 
} from 'redux/modules/siteReducer';
import LogoutLink from 'components/LogoutLink';

class SiteList extends Component {

  componentWillMount () {
    this.setState({
      open: this.props.open ? this.props.open : false
    });
  }

  // Opens/closes side bar slider
  openClick(event) {
    if(event) {
      event.preventDefault();
    }
    this.setState({
      open: !this.state.open
    });
  }

  // Logs out of proudcity
  logOutClick(event) {
    event.preventDefault();
    this.props.actions.siteLogOut();
  }

  // Edit a site // @ TODO currently hidden
  editClick(event, site) {
    event.preventDefault();
    this.props.actions.siteCreateForm(site && site.siteId ? site.siteId : '');
    this.openClick();
  }

  // View a site
  viewClick(event, site) {
    event.preventDefault();
    this.props.actions.siteChangeSite(site.siteId);
    this.openClick();
  }

  // On CMS, sets the siteId in the DB
  setSiteClick(event) {
    event.preventDefault();
    this.props.actions.siteChangeSite(config.siteId, true);
  }

  // Prints header section
  header(siteState, offCanvas) {
    if(!offCanvas) {
      return '';
    }

    // CSS classes
    const menuClass = this.state.open ? 'fa-times' : 'fa-bars';

    // Gets title of site
    let title = 'Choose a site';
    if( siteState.currentSite ) {
      title = (siteState.currentSite.title) ? siteState.currentSite.title : title;
    }

    return (
      <div className="sites-header clearfix">
        {(config.siteId && config.mode === 'preview' && siteState.status === SITE_LOADED) && (
          <a href="#" className="site-set btn btn-primary" onClick={this.setSiteClick.bind(this)}>Use this site</a>
        )}
        <LogoutLink logOutClick={this.logOutClick.bind(this)} show={config.mode === 'standalone'} />
        <h3>{title}</h3>
        <a className="menu-toggle" href="#" onClick={this.openClick.bind(this)}><i className={"fa fa-2x " + menuClass}></i></a>
      </div>
    );
  }

  // Prints list of sites
  siteList(sites) {
    // What text to display in sites list
    const viewText = config.application ? 'Preview Dashboard' : 'View Dashboard';

    return (
      <div className="list-group">
        <div key="new" className="list-group-item">
          <p><a href="#" onClick={(event)=>this.editClick(event)} className="btn btn-success">Add</a> new site </p>
        </div>
        {sites.map((site, key) => (
          <div key={key} className="list-group-item">
            <h4 className="list-group-item-heading">{site.title} <br/><small>{site.url}</small></h4>
            <a href="#" onClick={(event)=>this.viewClick(event, site)} className="btn btn-primary">{viewText}</a>
            <a href={site.url} target="_blank" className="btn btn-default">View Site</a>
            {(config.mode === 'standalone') && (
              <a href="#" onClick={(event)=>this.editClick(event, site)} className="btn btn-default">Edit</a>
            )}
          </div>
        ))}
      </div>
    );
  }

  render () {
    const { siteState, offCanvas } = this.props;

    // Only show if we're in agent / standalone
    // OR if there is no siteId
    const show = config.mode === 'agent' || config.mode === 'standalone' || config.mode === 'preview'  || !config.siteId;
    if ( !show ) {
      return (
        <div></div>
      );
    }

    // Switches between static list or offcanvas slider 
    const wrapperClass = offCanvas ? ' off-canvas' : '';
    // We opened or closed?
    const openClass = this.state.open ? ' open' : '';

    return (
      <div className={"sites-list-wrapper" + wrapperClass}>
        {this.header(siteState, offCanvas)}
        <div className={"sites-list" + openClass}>
          {this.siteList(siteState.sites)}
        </div>
      </div>
    );
  }
}

SiteList.propTypes = {
  actions: PT.object.isRequired,
  siteState: PT.object.isRequired,
  offCanvas: PT.bool,
  open: PT.bool
};

function mapStateToProps (state) {
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
)(SiteList);
