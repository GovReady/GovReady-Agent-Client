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
      'url': '',
      'accessible': '',
      'application': config.application ? config.application : ''
    };
  }

  // Submits a site form
  siteSubmit(data) {
    
    let { siteState, actions }  = this.props;

    const submitFields = [
      'title',
      'url',
      'application'
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
        this.props.actions.siteUpdate(assignProps({}, data));
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
