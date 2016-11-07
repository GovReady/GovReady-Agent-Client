import React, { Component } from 'react';
import { default as config } from 'config';
import Widget from '../Widget';
import RefreshButton from 'components/RefreshButton';
import StackWidget from './StackWidget';
// import StackPage from './StackPage';

class Stack extends Component {

  static defaultProps = {
    widget: {},
    widgetQuery: {
      url: 'stack',
      process: (data) => {
        return data;
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
        <div>StackPage</div>
      )
    }
    else {
      return (
        <StackWidget 
          header={Widget.titleSection('System', false, 'h3')} 
          refreshButton={(<RefreshButton widgetName={this.props.widgetName} widgetQuery={this.props.widgetQuery} />)}
          systemData={widget.data} 
          assessmentState={this.assessmentStateMarkup(widget.data.scan)} />
      )
    }
  }
}

Stack.propTypes = Widget.propTypes();

export default Widget.connect(Stack);