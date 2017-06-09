import React, { PropTypes as PT, Component } from 'react';
import { default as config } from 'config';
import Widget from '../../Widget';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import objectAssign from 'object-assign';
import { reset as formReset, startSubmit } from 'redux-form';
import { actions } from 'redux/modules/widgetReducer';
import { actions as crudActions } from 'redux/modules/submissionsReducer';
import { actions as messageActions } from 'redux/modules/messageReducer';
import { isoSort } from 'utils/date';
import SubmissionsList from './SubmissionsList';
import SubmissionsWidget from './SubmissionsWidget';
import SubmissionsPage from './SubmissionsPage';
import SubmissionEditPage from './SubmissionEditPage';

class Submissions extends Component {

  static defaultProps = {
    widget: {},
    widgetName: 'Submissions',
    submitFields: [
      'measureId',
      'name',
      'body'
    ]
  }

  constructor(props) {
    super(props);
    this.state = {
      formOpen: false
    };
  }

  componentWillMount () {
    Widget.registerWidget(
      this, 
      false
    );
    // Loading all 
    if (this.props.widget.status !== 'loaded') {
      this.props.crudActions.fetchRemote(config.apiUrl + 'submissions?limit=100', true)
        .then(() => Widget.loadComplete(this))
        .catch((e) => Widget.loadComplete(this, e));
    }
    // Loading single
    if (this.props.measureId && this.props.display === 'list') {
      this.props.crudActions.fetchRemote(config.apiUrl + 'measures/' + this.props.measureId + '/submissions', true);
    }
  }

  processData (data) {
    return {
      submissions: data
    }
  }

  // static defaultProps = {
  //   widget: {},
  //   submitFields: [
  //     'measureId',
  //     'name',
  //     'body'
  //   ]
  // }

  // componentWillMount() {
  //   // 
  // //   else if(this.props.display === 'page') {
  // //     fetchSubmissionsAllRecent();
  // //   }
  // //   else if(this.props.display === 'recent') {
  // //     this.fetchSubmissionsRecent();
  // //   }
  // }

  // // Fetches submissions by measureID
  // fetchSubmissionsByMeasure(measureId) {
    
  // }

  // // Gets most recent
  // fetchSubmissionsRecent() {
  //   this.props.crudActions.fetchRemote(config.apiUrl + 'submissions', false);
  // }

  // // Gets all most recent
  // fetchSubmissionsAllRecent() {
  //   this.props.crudActions.fetchRemote(config.apiUrl + 'submissions?limit=100', false);
  // }

  // Gets a single submission or empty
  getSingle(_id, submissions = []) {
    let submission;
    if(_id) {
      submission = submissions.find((item) => {
        return item._id === _id;
      });
      if(submission) {
        return submission;
      }
    }
    // Init default
    return {
      '_id': '',
      'measureId': this.props.measureId,
      'name': '',
      'body': this.props.bodyTemplate
    };
  }

  // Gets list of submissions by measureId
  getSubmissionsRecent(count = 3) {
    return isoSort(this.props.submissions, 'datetime', 'desc')
      .slice(0, count);
  }

  // Gets list of submissions by measureId
  getSubmissionsByMeasure(measureId, count = 3) {
    return isoSort(this.props.submissions.filter((submission) => submission.measureId === measureId)
      , 'datetime', 'desc').slice(0, count);
  }

  // Done with CRUD
  finishSubmit(message) {
    this.toggleForm(null, false);
    // Reset form
    this.props.formActions.reset('submissionEdit');
    // Set a message
    this.props.messageActions.messageAdd({
      level: 'success',
      content: message
    });
  }

  handleSubmit(data) {
   if (!data.name) {
      return Promise.reject({ name: 'Name is required', _error: 'Login failed!' });
    }
    const assignProps = (toSet, setData) => {
      this.props.submitFields.map((field) => {
        if(setData[field] || setData[field] === false) {
          toSet[field] = setData[field];
        }
      });
      return toSet;
    }
    // Start Submission
    this.props.formActions.startSubmit('submissionEdit');
    let { crudActions } = this.props;
    // Existing record
    if(data._id) {
      crudActions.updateRemote(
        config.apiUrl + 'measures/' + data.measureId + '/submissions', 
        data,
        '/dashboard/Measures/' + data.measureId,
        false
      ).then(this.finishSubmit('The submission has been updated.'));
    } 
    // New item
    else {
      crudActions.createRemote(
          config.apiUrl + 'measures/' + data.measureId + '/submissions', 
          assignProps({}, data),
          '/dashboard/Measures/' + data.measureId,
          false
        ).then(() => {
          this.finishSubmit('A new submission has been created.');
          this.props.submissionCallback(data.measureId);
        });
    }
  }

  // Func toggles form open on submission edit
  toggleForm (e, state = !this.state.formOpen) {
    if (e) { 
      e.preventDefault(); 
    }
    this.setState({formOpen: state});
  }

  render () {

    let { display, measureId, isNew, bodyTemplate, count } = this.props;

    if(display === 'form' ||  display === 'formDropdown' || display === 'pageIndividualEdit') {
      let submission, headerText;

      // Creating new submission
      if(isNew){
        submission = this.getSingle(null);
      }
      // not a new submission, so filter
      else if(measureId) {
        submission = this.getSingle(measureId, submissions);
        headerText = submission.title;
      }
      // Bind toggle form func ?
      const toggleForm = display === 'formDropdown'
                       ? this.toggleForm.bind(this)
                       : null;
      return (
          <SubmissionEditPage 
            header={headerText}
            formOpen={this.state.formOpen}
            toggleForm={toggleForm} 
            submission={submission}
            submissionSubmit={this.handleSubmit.bind(this)} />
        )
      
    }
    if(display === 'list') {
      // Individual measure
      if(measureId) {
        return (
          <SubmissionsList 
            submissions={this.getSubmissionsByMeasure(measureId, count)} />
        )
      }
    } else if (display === 'page') {
      return (
        <SubmissionsPage
          submissions={this.getSubmissionsRecent(1000)} />
      )
    }
    return (
      <SubmissionsWidget
        submissions={this.getSubmissionsRecent(count)} />
    )
  }
}

Submissions.propTypes = Widget.propTypes({
  individual: PT.number,
  isNew: PT.bool,
  measureId: PT.string,
  bodyTemplate: PT.string,
  submissionCallback: PT.func
});

// Hooked up to multiple reducers, so dont use stock Widget methods

function mapStateToProps (state, ownProps) {
  return {
    widget: state.widgetState.widgets['Submissions'],
    submissions: state.submissionsState
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    formActions: {
      reset: bindActionCreators(formReset, dispatch),
      startSubmit: bindActionCreators(startSubmit, dispatch)
    },
    crudActions: bindActionCreators(crudActions, dispatch),
    messageActions:  bindActionCreators(messageActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Submissions);
