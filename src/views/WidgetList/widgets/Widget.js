import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hashHistory, RouterContext, Link } from 'react-router';
import { push } from 'react-router-redux';
import { default as config } from 'config';
import { actions } from 'redux/modules/widgetReducer';
import objectAssign from 'object-assign';

class Widget {

  // Registers widget with import, load data functions
  static registerWidget(widgetCntrl, payload = false) {
    let {widget, actions, widgetName, widgetQuery} = widgetCntrl.props;
    // Do we need to register initial state info?
    if(!widget || !widget.status) {
      actions.widgetImported(widgetName);
    }
    // Do we need to get payload?
    if(payload && (!widget || widget.status !== 'loaded')) {
      actions.widgetLoadData(
        widgetName,
        widgetQuery.url, 
        widgetQuery.process
      );
    }
  }

  // Default widget 
  static propTypes (props = {}) {
    return objectAssign(props, {
      widgetType: PT.string,
      display: PT.string.isRequired,
      widget: PT.object.isRequired,
      widgetQuery: PT.object,
      widgetName: PT.string.isRequired,
      actions: PT.object.isRequired
    });
  }

  // Helper redux state
  static mapStateToProps (state, ownProps) {
    return {
      widget: state.widgetState.widgets[ownProps.widgetName]
    };
  }

  // Helper redux dispatch
  static mapDispatchToProps (dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }

  // Helper connect
  static connect (widget) {
    return connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(widget);
  }

  // Displays a widget's error if applicable
  static errorDisplay (status: string, widgetName: string, panel: bool = false) {
    if(status !== 'load_failed') {
      return '';
    }
    let text;
    if(config.mode === 'remote' || config.mode === 'local') {
      text = 'The data for "' + widgetName + '" could not be loaded.  Please try refreshing to re-aggregate.';
    }
    else {
      text = 'The data for "' + widgetName 
           + '" could not be loaded.  You need to navigate to an active install of the govready ' 
           + config.pluginText.toLowerCase() + ' in order to run aggregation';
    }
    if(panel) {
      return (
        <div className="panel panel-default"><div className="panel-body">
          <div className="alert alert-warning"><p>{text}</p></div>
        </div></div>
      )
    }
    return (
      <div className="alert alert-warning"><p>{text}</p></div>
    )
  }

  // Displays widget loading
  static loadingDisplay () {
    return (
      <div className='loading'>
        <i className='fa fa-spinner fa-2x fa-spin'></i><span className='sr-only'>Loading</span>
      </div>
    );
  }

  // Displays failed text
  static loadFailed (widgetName) {
    return (
      <p>
        Sorry, {widgetName} is not avalable right now.
      </p>
    );
  }

  // Helper function sets hmtl field
  static setHtml(text) {
    return {
      dangerouslySetInnerHTML: {
        __html: text
      }
    }
  }

  // Creates page header section
  static titleSection (text, pageUrl, header = 'h3', absolute = false, backlink = false, overrideUrl = '/dashboard') {
    const headerInner = () => {
      if(pageUrl && !absolute) {
        return (
          <div>
            <Link className='title-text' to={`/dashboard/${pageUrl}`}>
              {text}
            </Link>
          </div>
        )
      }
      else if(pageUrl) {
        return (
          <div>
            <a className='title-text' href={pageUrl} target="_blank">
              {text}
            </a>
          </div>
        )
      }
      else if(false && backlink) {
        return (
          <span>
            <span>{text}</span>
            {this.backLink('Back', 'back btn btn-primary pull-right', overrideUrl)}
          </span>
        )
      }
      else {
        return text;
      }
    } 

    return (
      <div className='title'>
        {React.createElement(header, {}, headerInner())}
      </div>
    );
  }

  // Creates a panel footer with link
  static panelFooter (text, pageUrl, absolute = false, refresh = false, widgetName) {
    return (
      <div className='panel-footer'>
        {pageUrl && !absolute &&
          <Link className='title-text' to={`/dashboard/${pageUrl}`}>
            {text} <i className='fa fa-chevron-right'></i>
          </Link>
        }
        {pageUrl && absolute &&
          <a href={pageUrl} target="_blank" className="title-text">
            {text} <i className='fa fa-chevron-right'></i>
          </a>
        }
        {!pageUrl && 
          <div>{text}</div>
        } 
      </div>
    );
  }
}

export default Widget;
