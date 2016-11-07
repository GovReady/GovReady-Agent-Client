import React, { Component } from 'react';
import { default as config } from 'config';
import Widget from '../Widget';
import RecommendedWidget from './RecommendedWidget';

class Recommended extends Component {

  static defaultProps = {
    widget: {},
    widgetQuery: {
      url: 'recommended',
      process: (data) => {
        return {
          plugins: data
        } 
      }
    }
  }

  componentWillMount () {
    Widget.registerWidget(
      this, 
      true
    );
  }

  assessmentState (scan) {
    if (scan && scan.state) {
      return scan.state;
    }
    return "Not run";
  } 

  assessmentStateMarkup (scan) {
    let classname = 'danger';
    const text = this.assessmentState(scan)
    if (text === 'Passing') {
      classname = 'success';
    }
    return (
      <span className={'label label-' + classname}>{text}</span>
    );
  }

  render () {

    let widget = this.props.widget;
    
    // Return loading if not set
    if(!widget || widget.status !== 'loaded') {
      return Widget.loadingDisplay();
    }

    if(this.props.display === 'page') {
      // @TODO?
      return (
        <div>RecommendedPage</div>
      )
    }
    else {
      return (
        <RecommendedWidget 
          pluginText={config.pluginText}
          pluginUrl={config.pluginUrl}
          header={Widget.titleSection('Recommended security ' + config.pluginText.toLowerCase() + 's' , false, 'h3')} 
          plugins={widget.data.plugins} />
      )
    }
  }
}

Recommended.propTypes = Widget.propTypes();

export default Widget.connect(Recommended);