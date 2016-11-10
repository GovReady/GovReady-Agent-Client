import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { default as config } from 'config';
import { 
  actions,
  SITE_LOADED 
} from 'redux/modules/siteReducer';

class SiteList extends Component {

  componentWillMount () {
    this.setState({
      open: this.props.open ? this.props.open : false
    });
  }

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

  render () {
    const { siteState, offCanvas } = this.props;

    // Only show if we're in agent / standalone
    // OR if there is no siteId
    const show = ( config.mode === 'agent' || config.mode === 'standalone' || config.mode === 'preview'  || !config.siteId )
               && siteState.sites && siteState.sites.length;

    if ( !show ) {
      return (
        <div></div>
      );
    }

    // CSS classes
    const wrapperClass = offCanvas ? ' off-canvas' : '';
    const openClass = this.state.open ? ' open' : '';
    const menuClass = this.state.open ? 'fa-times' : 'fa-bars';

    // Gets title of site
    let title = 'Choose a site';
    if( siteState.currentSite ) {
      title = (siteState.currentSite.title) ? siteState.currentSite.title : title;
    }

    // What text to display in sites list
    const viewText = config.application ? 'Preview' : 'View';

    return (
      <div className={"sites-list-wrapper" + wrapperClass} >
        {offCanvas && (
          <div className="sites-header clearfix">
            {(config.siteId && config.mode === 'preview' && siteState.status === SITE_LOADED) && (
              <a href="#" className="site-set btn btn-primary" onClick={this.setSiteClick.bind(this)}>Use this site</a>
            )}
            {config.mode === 'standalone' && (
              <a className="log-out btn" href="#" onClick={this.logOutClick.bind(this)}>Log out</a>
            )}
            <h3>{title}</h3>
            <a className="menu-toggle" href="#" onClick={this.openClick.bind(this)}><i className={"fa fa-2x " + menuClass}></i></a>
          </div>
        )}
        <div className={"sites-list" + openClass}>
          <div className="list-group">
            <div key="new" className="list-group-item">
              <p><a href="#" onClick={(event)=>this.editClick(event)} className="btn btn-success">Add</a> new site </p>
            </div>
            {siteState.sites.map((site, key) => (
              <div key={key} className="list-group-item">
                <h4 className="list-group-item-heading">{site.title}</h4>
                <p><a href={site.url} target="_blank"><i className="fa fa-share"></i> {site.url}</a></p>
                <a href="#" onClick={(event)=>this.viewClick(event, site)} className="btn btn-primary">{viewText}</a>
                {false && (
                  <a href="#" onClick={(event)=>this.editClick(event, site)} className="btn btn-default">Edit</a>
                )}
              </div>
            ))}
          </div>
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
