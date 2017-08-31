import React, { Component } from 'react';
import { PropTypes as PT } from 'prop-types';
import { default as config } from 'config';
import Widget from '../Widget';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import objectAssign from 'object-assign';
import { Link } from 'react-router';
import { actions } from 'redux/modules/widgetReducer';
import { actions as crudActions } from 'redux/modules/measuresReducer';
import { actions as messageActions } from 'redux/modules/messageReducer';
import { isoToDate, dateToIso, isoSort, timeOptions } from 'utils/date';
import MeasuresWidget from './MeasuresWidget';
import MeasuresPage from './MeasuresPage';
import MeasureSingle from './Measure/MeasureSingle';
import MeasureEditPage from './Measure/MeasureEditPage';
import { freqOptions } from './Measure/MeasureEditPage';
import Loading from './Loading.js';

class Measures extends Component {

  static defaultProps = {
    widget: {},
    submitFields: [
      'title',
      'body',
      'frequency',
      'due'
    ]
  }

  componentWillMount () {
    Widget.registerWidget(
      this, 
      false
    );
    if (this.props.widget.status !== 'loaded') {
      this.props.crudActions.fetchRemote(config.apiUrl + 'measures')
        .then(() => Widget.loadComplete(this))
        .catch((e) => Widget.loadComplete(this, e));
    }
  }

  processData (data) {
    return {
      measures: data
    }
  }

  importDefaultMeasures(e) {
    e.preventDefault();
    this.props.crudActions.importDefault(config.apiUrl + 'measures/load/default');
  }

  createDefault(text, classes) {
    // console.log(this);
  }

  createNewLink(text, to = 'new', classes) {
    return (
      <Link className={classes} to={'/dashboard/Measures/' + to} >{text}</Link>
    );
  }

  // Returns markup for next due
  nextSubmissionDue(measure) {
    if (!measure) {
      return '';
    }
    const due = window.moment(measure.due);
    const dueDay = due.diff(timeOptions.now, 'd');
    let isPast = false;
    let timeString;
    // Somewhere in the -1 - 1 day range
    if ((dueDay * dueDay) <= 1) {
      if (due.isSame(timeOptions.yest, 'd')) {
        isPast = true;
        timeString = 'yesterday';
      } else if (due.isSame(timeOptions.tom, 'd')) {
        timeString = 'tomorrow';
      } else {
        // Today
        timeString = 'today';
      }
    } else {
      // In past ?
      if(due.diff(timeOptions.now) < 0) {
        isPast = true;
      }
      timeString = due.fromNow();
    }

    const classes = () => isPast ? 'label label-warning' : 'label label-info';
    return (
      <div className={classes()}>
        Due {timeString}
      </div>
    )
  }

  // Gets a single measure or empty
  getSingle(_id, measures) {
    if(_id) {
      const measure = measures.find((item) => {
        return item._id === _id;
      });
      if(measure) {
        return measure;
      }
    }
    return {
      '_id': '',
      'title': '',
      'body': '',
      'frequency': '',
      'due': '',
      'confirmDelete': ''
    };
  }

  // Gets list of submissions by due date
  getMeasuresByDueDate(count = 3) {
    return isoSort(this.props.measures.filter((measure) => measure.due), 'due').slice(0, count);
  }

  // Done with CRUD
  finishSubmit(message) {
    // Set a message
    this.props.messageActions.messageAdd({
      level: 'success',
      content: message
    });
  }

  
  handleSubmit(data) {

    let { widget, submitFields, crudActions }  = this.props;

    const assignProps = (toSet, setData) => {
      submitFields.map((field) => {
        if(setData[field] || setData[field] === false) {
          toSet[field] = setData[field];
        }
      });
      return toSet;
    }

    if(widget && widget.status !== 'posting') {
      // Convert to server time format
      data.due = dateToIso(data.due);
      // Make sure frequency is set
      data.frequency = data.frequency || freqOptions[0].time;
      // Existing record
      if(data._id) {
        crudActions.updateRemote(
          config.apiUrl + 'measures/' + data._id, 
          data,
          '/dashboard/Measures/',
          true
        ).then(this.finishSubmit('The scheduled task has been updated.'));
      } 
      // New item
      else {
        crudActions.createRemote(
          config.apiUrl + 'measures', 
          assignProps({}, data),
          '/dashboard/Measures/',
          true
        ).then(this.finishSubmit('A new scheduled task has been created.'));
      }
    }
  }

  measureDelete(measure) {
    if(measure._id && measure._id.value) {
      this.props.crudActions.deleteRemote(
        config.apiUrl + 'measures/' + measure._id.value, 
        measure, 
        '/dashboard/Measures'
      ).then(this.finishSubmit('The scheduled task has been deleted.'));
    }
    else {
      //error

    }
  }

  // Get measure from url
  measureSync(_id) {
    const measure = this.getSingle(_id, this.props.measures);
    return this.props.crudActions.syncRemote(
      config.apiUrl + 'measures/' + measure._id,
      measure
    );
  }

  render () {

    let { widget, widgetName, measures, display, isNew, individual } = this.props;

    // Return loading if not set
    if(!widget.status || widget.status !== 'loaded') {
      if(display === 'widget'){
        return <Loading />;
      } else {
        return Widget.loadingDisplay();
      }
    }
    // Measure view page
    if(display === 'pageIndividual') {
      const measure = this.getSingle(individual, measures);
      return (
        <MeasureSingle
          createNewLink={this.createNewLink.bind(this)}
          due={this.nextSubmissionDue(measure)}
          submissionCallback={this.measureSync.bind(this)}
          measure={measure} />
      );
    }
    // Measure edit page
    else if(display === 'pageIndividualEdit') {
      let measure, headerText;

      // Creating new measure
      if(isNew){
        headerText = 'New Scheduled Task';
        measure = this.getSingle(null);
      }
      // not a new measure, so filter
      else if(individual) {
        measure = this.getSingle(individual, measures);
        headerText = measure.title;
      }
      // Measure loading failed
      
      return (
        <MeasureEditPage 
          headerText={headerText} 
          measure={measure}
          measureSubmit={this.handleSubmit.bind(this)}
          measureDelete={this.measureDelete.bind(this)}
          createDefault={this.importDefaultMeasures.bind(this)}
          createNewLink={this.createNewLink.bind(this)} />
      )
    }
    // Measures list page
    else if(display === 'page') {
      return (
        <MeasuresPage
          createNewLink={this.createNewLink.bind(this)}
          nextSubmissionDue={this.nextSubmissionDue.bind(this)}
          measures={isoSort(measures, 'due')} />
      )
    }
    // Widget
    else {
      return (
        <MeasuresWidget 
          headerLink={<Link to='/dashboard/Measures'>Scheduled Tasks</Link>}
          createDefault={this.importDefaultMeasures.bind(this)}
          createNewLink={this.createNewLink.bind(this)}
          nextSubmissionDue={this.nextSubmissionDue.bind(this)}
          measures={this.getMeasuresByDueDate()} />
      )
    }
  }
}

Measures.propTypes = Widget.propTypes({
  individual: PT.oneOfType([
    PT.number,
    PT.string,
  ]),
  isNew: PT.bool
});

// Hooked up to multiple reducers, so dont use stock Widget methods

function mapStateToProps (state, ownProps) {
  return {
    widget: state.widgetState.widgets[ownProps.widgetName],
    measures: state.measuresState
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    crudActions: bindActionCreators(crudActions, dispatch),
    messageActions:  bindActionCreators(messageActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Measures);
