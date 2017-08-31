import React, { Component } from 'react';
import { PropTypes as PT } from 'prop-types';
import { Link } from 'react-router';
import { isoToDate } from 'utils/date';

// Prints measure specific submissions
class SubmissionsList extends Component {

  submissionsList (submissions, showTitle) {
    if(submissions && submissions.length) {
      return (
        <div>
          {submissions.map((submission, index) => (
            <div key={submission._id} className="submission row list-border">
              <h4 className="clearfix">
                <div className="col-sm-9">
                  {showTitle && 
                    <Link className="margin-right-10" to={'/dashboard/Measures/' + submission.measureId}>{submission.title}</Link> 
                  }
                  <span className="color-text">By {submission.name}</span>
                </div>
                <div className="col-sm-3 text-right">
                  <span className="label label-primary">{isoToDate(submission.datetime)}</span>
                </div>
              </h4>
              <div className="col-xs-12">
                <label>Task Report</label>
                <pre>
                  {submission.body}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )
    }
    // No submissions, return empty
    return (
      <div className="alert alert-warning">
        <span>No submissions added yet.</span>
      </div>
    );
  }

  render () {
    return (
      <div>
        {this.props.header && (
          <div>{this.props.header}</div>
        )}
        {this.submissionsList(this.props.submissions, this.props.showTitle)}
      </div>
    );
  }
}

SubmissionsList.propTypes = {
  header: PT.string,
  showTitle: PT.bool,
  submissions: PT.array.isRequired
};

export default SubmissionsList;
