import React, { Component } from 'react';
import { PropTypes as PT } from 'prop-types';
import Messages from 'components/Messages';
import BackButton from 'components/BackButton';
import SubmissionsList from './SubmissionsList';

class MeasuresPage extends Component {
  render () {
    return (
      <div>
        <div className='text'>
          <h2>
            <span>All Recent Task Reports</span>
            <BackButton backUrl='/dashboard' />
          </h2>
        </div>
        <Messages />
        <hr/>
        <SubmissionsList
          showTitle={true}
          submissions={this.props.submissions} />
      </div>
    );
  }
}

MeasuresPage.propTypes = {
  submissions: PT.array.isRequired
};

export default MeasuresPage;
