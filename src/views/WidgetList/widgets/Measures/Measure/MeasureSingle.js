import React, { PropTypes as PT, Component } from 'react';
import Submissions from '../Submissions/Submissions';
import { freqOptions } from './MeasureEditPage';
import BackButton from 'components/BackButton';

class MeasureSingle extends Component {
  render () {
    let {header, due, measure, createNewLink} = this.props;
    // Returns Frequency text
    const frequency = () => {
      const freq = freqOptions.find((item) => {
        return item.time === measure.frequency;
      });
      return freq ? freq.label : 'Unknown';
    };
    if(!measure || !measure._id) {
      return (
        <div>
            <h2>Sorry there was an issue getting the measure.</h2>
            <BackButton text='Go back' classes='btn btn-default' />
        </div>
      )
    }
    return (
      <div>
        <div className='text'>
          <h2>
            <span>{measure.title}</span>
            <BackButton backUrl='/dashboard/Measures' />
          </h2>
        </div>
        <ul className="list-inline">
          <li><h4>{due}</h4></li>
          <li>{createNewLink('Edit', measure._id + '/edit', 'btn btn-default')}</li>
        </ul>
        <div className="row">
          <div className="col-sm-12">
            <p><label>Frequency:</label> {frequency()}</p>
          </div>
          <div className="col-sm-6">
            <p></p>
          </div>
        </div>
        <div>
          <label>Task Template:</label>
          <pre>
            {measure.body}
          </pre>
        </div>
        <hr/>
        <h4>Submit New Task Report</h4>
        <Submissions display="form" bodyTemplate={measure.body} isNew={true} measureId={measure._id} />
        <hr/>
        <h4>Recent Task Reports</h4>
        <Submissions display="list" measureId={measure._id} />
      </div>
    );
  }
}

MeasureSingle.propTypes = {
  createNewLink: PT.func.isRequired,
  measure: PT.object.isRequired,
  due: PT.object.isRequired,
  submissions: PT.array.isRequired
};

export default MeasureSingle;
