import React, { PropTypes as PT, Component } from 'react';
import { Link } from 'react-router';
import { isoToDate } from 'utils/date';

// Prints site wide recents
class SubmissionsRecent extends Component {

  submissionsList (submissions) {
    if(submissions && submissions.length) {
      return submissions.map((submission, index) => (
        <div className='row list-border list-border-small'>
          <div className="col-sm-8">
            <div className="row">
              <div className="col-sm-8 overflow-col">
                <Link to={'/dashboard/Measures/' + submission.measureId}>{submission.title}</Link>
              </div>
              <div className="col-sm-4 overflow-col">
                <span className="author"> <span>By:</span> {submission.name}</span>
              </div>
            </div>
          </div>
          <div className="col-sm-4 text-right">
            <div className="label label-primary">{isoToDate(submission.datetime)}</div>
          </div>
        </div>
      ));
      // const header= (submission) => {
      //   return (
          
      //   )
      // }
      // return (
      //   <Accordion>
      //     {submissions.map((submission, index) => (
      //       <Panel header={header(submission)} eventKey={index} key={index}>
      //         <p>
                
      //         </p>
      //         <pre>
      //           {submission.body}
      //         </pre>
      //         <hr />
      //         <div>
                
      //         </div>
      //       </Panel>
      //     ))}
      //   </Accordion>
      // )
    }
    // No submissions, return empty
    return (
      <div className="alert alert-warning">
        <span>No task reports made.</span>
      </div>
    );
  }

  render () {
    return (
      <div>
        {this.submissionsList(this.props.submissions)}
      </div>
    );
  }
}

SubmissionsRecent.propTypes = {
  submissions: PT.array.isRequired
};

export default SubmissionsRecent;
