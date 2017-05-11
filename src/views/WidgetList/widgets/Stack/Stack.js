import React, { Component } from 'react';
import { default as config } from 'config';
import Widget from '../Widget';
import RefreshButton from 'components/RefreshButton';
import Loading from 'components/loading/HorizontalTable';
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

    let {widget, widgetName, display} = this.props;

    // Return loading if not set
    if(!widget.status || widget.status !== 'loaded') {
      let errorDisplay = Widget.errorDisplay(widget.status, widgetName); 
      return errorDisplay ? errorDisplay : <Loading />;
    }
    return (
      <StackWidget 
        refreshButton={(<RefreshButton widgetName={this.props.widgetName} widgetQuery={this.props.widgetQuery} />)}
        systemData={widget.data} 
        assessmentState={this.assessmentStateMarkup(widget.data.scan)} />
    )
  }
}

Stack.propTypes = Widget.propTypes();

export default Widget.connect(Stack);