import React, { Component } from 'react';
import { PropTypes as PT } from 'prop-types';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import objectAssign from 'object-assign';
import { WidgetList } from '../WidgetList';
import { bindActionCreators } from 'redux';
import { default as config } from 'config';
import SiteEditForm from './SiteEditForm';
import { 
  actions,
  SITE_UPDATE_START
} from '../../redux/modules/siteReducer';

class SiteEdit extends Component {
  
  // Gets a single measure or empty
  getSiteObject(_id = null) {
    if(_id) {
      const site = this.props.siteState.sites.find((item) => {
        return item.siteId === _id;
      });
      if(site) {
        console.log(site);
        return objectAssign({
          _id,
          type: site.application ? site.application : 'other' 
        }, site);
      }
    }
    return {
      '_id': '',
      'type': '',
      'title': '',
      'url': config.mode !== 'standalone' ? config.clientUrl : '',
      'accessible': '', 
      'otherApplication': '',
      'application': config.application ? config.application : '',
      'confirmDelete': ''
    };
  }

  // Submits a site form
  siteSubmit(data) {
    
    let { siteState, actions }  = this.props;

    // @TODO figure out post accessible as status: {}
    const submitFields = [
      'title',
      'url',
      'accessible',
      'application',
      'otherApplication'
    ];

    const assignProps = (toSet, setData) => {
      submitFields.map((field) => {
        if(setData[field] || setData[field] === false) {
          toSet[field] = setData[field];
        }
      });
      return toSet;
    }

    if(siteState.status !== SITE_UPDATE_START) {
      // Existing record
      if(data._id) {
        // posting null to API was resulting in a string
        this.props.actions.siteUpdate(objectAssign({}, data, {
          application: data.application || ''
        }));
      } 
      // New item
      else {
        this.props.actions.siteUpdate(assignProps({}, data)).then();
      }
    }
  }

  // Deletes a site
  siteDelete(data) {
    if (data._id && data._id.value) {
      this.props.actions.siteDelete(data._id.value);
    }
  }

  render () {
    const { siteState } = this.props;
    const site = this.getSiteObject(siteState.editSite);
    return (
      <SiteEditForm 
        site={site}
        locked={site.application ? true : false}
        appDisabled={config.application ? true : false}
        siteSubmit={this.siteSubmit.bind(this)}
        siteDelete={this.siteDelete.bind(this)} />
    );
  }
}

SiteEdit.propTypes = {
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
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteEdit);
