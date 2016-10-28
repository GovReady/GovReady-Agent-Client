import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { WidgetList } from '../WidgetList';
import { bindActionCreators } from 'redux';
import { default as config } from 'config';
import SiteEditForm from './SiteEditForm';
import { 
  actions
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
      'title': '',
      'url': ''
    };
  }

  // Submits a site form
  siteSubmit(data) {
    console.log('yolo');
  }

  // Deletes a site
  siteDelete(data) {
    console.log('yolo');
  }

  render () {
    let { siteState } = this.props;
    const site = this.getSiteObject();
    return (
      <SiteEditForm 
        site={site}
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
