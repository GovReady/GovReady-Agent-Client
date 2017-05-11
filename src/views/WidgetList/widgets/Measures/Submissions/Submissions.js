import React, { PropTypes as PT, Component } from 'react';
import { default as config } from 'config';
import Widget from '../../Widget';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import objectAssign from 'object-assign';
import { reset as formReset, startSubmit } from 'redux-form';
import { actions as crudActions } from 'redux/modules/submissionsReducer';
import { actions as messageActions } from 'redux/modules/messageReducer';
import SubmissionsList from './SubmissionsList';
import SubmissionsRecent from './SubmissionsRecent';
import SubmissionEditPage from './SubmissionEditPage';

class Submissions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formOpen: false
    };
  }

  static defaultProps = {
    widget: {},
    submitFields: [
      'measureId',
      'name',
      'body'
    ]
  }

  componentWillMount() {
    if(this.props.measureId && this.props.display === 'list') {
      this.fetchSubmissionsByMeasure(this.props.measureId);
    }
    else if(this.props.display === 'recent') {
      this.fetchSubmissionsRecent();
    }
  }

  // Fetches submissions by measureID
  fetchSubmissionsByMeasure(measureId) {
    this.props.crudActions.fetchRemote(config.apiUrl + 'measures/' + measureId + '/submissions');
  }

  // Gets most recent
  fetchSubmissionsRecent() {
    this.props.crudActions.fetchRemote(config.apiUrl + 'submissions');
  }

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
    return this.props.submissions.sort((a, b) => {
      return b.datetime > a.datetime
    }).slice(0, count);
  }

  // Gets list of submissions by measureId
  getSubmissionsByMeasure(measureId, count = 3) {
    return this.props.submissions.filter((submission) => submission.measureId === measureId).sort((a, b) => {
      return b.datetime > a.datetime
    }).slice(0, count);
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
      ).then(this.finishSubmit('A new submission has been created.'));
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
    }
    return (
      <SubmissionsRecent 
        submissions={this.getSubmissionsRecent(count)} />
    )
  }
}

Submissions.propTypes = {
  individual: PT.number,
  isNew: PT.bool,
  measureId: PT.string,
  bodyTemplate: PT.string
};

// Hooked up to multiple reducers, so dont use stock Widget methods

function mapStateToProps (state, ownProps) {
  return {
    submissions: state.submissionsState
  };
}

function mapDispatchToProps (dispatch) {
  return {
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
