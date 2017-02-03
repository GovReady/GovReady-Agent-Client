import React, { PropTypes as PT, Component } from 'react';
import { reduxForm, initialize, propTypes } from 'redux-form';
import PureInput from 'components/PureInput';
import DeleteConfirm from 'components/DeleteConfirm';
import DatePickerWrap from 'components/DatePickerWrap';
import BackButton from 'components/BackButton';
// Form fields
export const fields = [
  '_id',
  'measureId',
  'name',
  'body',
  'confirmDelete'
];

class SubmissionEditPage extends Component {

  editForm() {
    // Extract props
    const { fields: { 
      _id,
      measureId,
      name,
      datetime,
      body,
      data,
      confirmDelete 
    }, handleSubmit, submissionSubmit, submitting } = this.props;
    // No submission
    if(!measureId) {
      return (
        <div>
          <h2>Sorry there was an issue editing the submission.</h2>
          <BackButton text='Go back' classes='btn btn-default' />
        </div>
      )
    }
    return (
      <form onSubmit={handleSubmit(submissionSubmit)}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <div>
                <label className="control-label">Name (completed by)</label>
                <PureInput type="text" field={name}/>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <div>
                <label className="control-label">Task Report</label>
                <textarea rows="10" className="form-control" {...body}/>
                <div className="help-block">
                  Use the template provided in the field to log the measure completion
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="clearfix">
          <div className="pull-left">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? <i/> : <i/>} Submit
            </button>
          </div>
        </div>
      </form>
    )
  }

  render () {
    return (
      <div>
        {this.props.header && (
          <div>{this.props.header}</div>
        )}
        {this.editForm()}
      </div>
    );
  }
}

SubmissionEditPage.propTypes = {
  ...propTypes,
  header: PT.object,
  submission: PT.object.isRequired,
  submissionSubmit: PT.func.isRequired
};

export default reduxForm({
  form: 'submissionEdit',
  fields
},
(state, ownProps) => ({
  initialValues: {
    ...ownProps.submission
  }
})
)(SubmissionEditPage);