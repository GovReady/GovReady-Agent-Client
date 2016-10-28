import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { default as config } from 'config';
import { actions as widgetActions } from '../../redux/modules/widgetReducer';
import { 
  actions,
  getSiteFromSites,
  SITE_LOADED 
} from '../../redux/modules/siteReducer';

class SitesList extends Component {

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

  editClick(event, site) {
    event.preventDefault();
    this.props.actions.siteCreateForm(site && site.siteId ? site.siteId : '');
    this.openClick();
  }

  viewClick(event, site) {
    event.preventDefault();
    this.props.widgetActions.widgetClearData();
    this.props.actions.siteChangeSite(site.siteId);
    this.openClick();
  }

  render () {
    const { siteState } = this.props;
    const openClass = this.state.open ? ' open' : '';
    const menuClass = this.state.open ? 'fa-times' : 'fa-bars';

    let title = 'Choose a site';
    if( siteState.currentSite && siteState.sites ) {
      const currentSite = getSiteFromSites(siteState.sites, siteState.currentSite);
      title = (currentSite.title) ? currentSite.title : title;
    }

    if (!siteState.sites || !siteState.sites.length ) {
      return (
        <div></div>
      );
    }

    return (
      <div className="sites-list-wrapper">
        <div className="sites-header clearfix">
          <h3>{title}</h3><a href="#" onClick={this.openClick.bind(this)}><i className={"fa fa-2x " + menuClass}></i></a>
        </div>
        <div className={"sites-list" + openClass}>
          <div className="list-group">
            <div key="new" className="list-group-item">
              <p><a href="#" onClick={(event)=>this.editClick(event)} className="btn btn-success">Add</a> new site </p>
            </div>
            {siteState.sites.map((site, key) => (
              <div key={key} className="list-group-item">
                <h4 className="list-group-item-heading">{site.title}</h4>
                <p><a href={site.url} target="_blank"><i className="fa fa-share"></i> {site.url}</a></p>
                <a href="#" onClick={(event)=>this.viewClick(event, site)} className="btn btn-primary">View</a>
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

SitesList.propTypes = {
  actions: PT.object.isRequired,
  siteState: PT.object.isRequired,
  open: PT.bool
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
