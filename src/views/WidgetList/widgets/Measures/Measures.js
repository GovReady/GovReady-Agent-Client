import React, { PropTypes as PT, Component } from 'react';
import { default as config } from 'config';
import Widget from '../Widget';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import objectAssign from 'object-assign';
import { Link } from 'react-router';
import { actions } from 'redux/modules/widgetReducer';
import { actions as crudActions } from 'redux/modules/measuresReducer';
import { isoToDate, dateToIso, isoSort } from 'utils/date';
import MeasuresWidget from './MeasuresWidget';
import MeasuresPage from './MeasuresPage';
import MeasureSingle from './Measure/MeasureSingle';
import MeasureEditPage from './Measure/MeasureEditPage';
import { freqOptions } from './Measure/MeasureEditPage';

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
    this.props.crudActions.fetchRemote(config.apiUrl + 'measures');
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
    if(!measure) {
      return '';
    }
    const due = window.moment(measure.due);
    const now = window.moment();
    let isPast = false;
    if(due.diff(now) < 0) {
      isPast = true;
    }
    const classes = () => isPast ? 'label label-warning' : 'label label-info';
    return (
      <div className={classes()}>
        Due {due.fromNow()}
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
        );
      } 
      // New item
      else {
        crudActions.createRemote(
          config.apiUrl + 'measures', 
          assignProps({}, data),
          '/dashboard/Measures/',
          true
        );
      }
    }
  }

  measureDelete(measure) {
    // Launch all actions
    if(measure._id && measure._id.value) {
      this.props.crudActions.deleteRemote(config.apiUrl + 'measures/' + measure._id.value, measure, '/dashboard/Measures');
    }
    else {
      //error
    }
  }

  render () {

    let { widget, widgetName, measures, display, isNew, individual } = this.props;
    
    // Return loading if not set
    if(!widget || !widget.status) {
      return Widget.loadingDisplay();
    }
    // Measure view page
    if(display === 'pageIndividual') {
      const measure = this.getSingle(individual, measures);
      return (
        <MeasureSingle
          createNewLink={this.createNewLink.bind(this)}
          due={this.nextSubmissionDue(measure)}
          measure={measure} />
      );
    }
    // Measure edit page
    else if(display === 'pageIndividualEdit') {
      let measure, headerText;

      // Creating new measure
      if(isNew){
        headerText = 'New manual measure';
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
          headerLink={<Link to='/dashboard/Measures'>Manual Tasks</Link>}
          subHeaderLink={<Link to='/dashboard/Measures'>See all.</Link>}
          createDefault={this.importDefaultMeasures.bind(this)}
          createNewLink={this.createNewLink.bind(this)}
          nextSubmissionDue={this.nextSubmissionDue.bind(this)}
          measures={this.getMeasuresByDueDate()} />
      )
    }
  }
}

Measures.propTypes = Widget.propTypes({
  individual: PT.number,
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
    crudActions: bindActionCreators(crudActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Measures);
