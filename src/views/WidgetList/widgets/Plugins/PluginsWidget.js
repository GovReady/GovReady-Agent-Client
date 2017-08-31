import React, { Component } from 'react';
import { PropTypes as PT } from 'prop-types';

class PluginsWidget extends Component {

  render () {
    const { updates, cms , coreUpdate } = this.props;
    const coreLabel = () => {
      if(!coreUpdate) {
        return '';
      }
      if(coreUpdate === 'security') {
        return (
          <div><span className="label label-danger">{cms} Core security update!</span></div>
        )
      }
      return (
        <div><span className="label label-warning">{cms} Core update available</span></div>
      )
    }
    return (
      <div className='panel panel-default'>
        <div className='panel-body'>
          <h4>
            {(updates.reg + updates.sec)}
            <br/>
            <small>{this.props.pluginText} updates</small>
            {coreLabel()}
          </h4>
        </div>
        {this.props.refreshButton}
        {this.props.footer}
      </div>
    );
  }
}

PluginsWidget.propTypes = {
  cms: PT.string.isRequired,
  pluginText: PT.string.isRequired,
  updates: PT.object.isRequired,
  coreUpdate: PT.string,
  footer: PT.object.isRequired
};

export default PluginsWidget;
