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
    if(!widget.status || widget.status === 'loading') {
      return Widget.loadingDisplay();
    }

    const plugins = widget.data && widget.data.plugins ? widget.data.plugins : [];
    return (
      <RecommendedWidget 
        pluginText={config.pluginText}
        pluginUrl={config.pluginUrl}
        headerText={'Recommended security ' + config.pluginText.toLowerCase() + 's'}
        plugins={plugins} />
    )
  }
}

Recommended.propTypes = Widget.propTypes();

export default Widget.connect(Recommended);