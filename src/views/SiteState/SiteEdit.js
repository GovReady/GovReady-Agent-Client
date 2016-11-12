import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
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
      // const measure = measures.find((item) => {
      //   return item._id === _id;
      // });
      // if(measure) {
      //   return measure;
      // }
    }
    return {
      '_id': '',
      'type': '',
      'title': '',
      'url': config.mode !== 'standalone' ? window.location.protocol + '//' + window.location.host  : '',
      'accessible': '',
      'otherApplication': '',
      'application': config.application ? config.application : ''
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
        this.props.actions.siteUpdate(data);
      } 
      // New item
      else {
        this.props.actions.siteUpdate(assignProps({}, data)).then();
      }
    }
  }

  // Deletes a site
  siteDelete(data) {
    console.log('TODO');
  }

  render () {
    let { siteState } = this.props;
    const site = this.getSiteObject();
    return (
      <SiteEditForm 
        site={site}
        locked={config.application ? true : false}
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
