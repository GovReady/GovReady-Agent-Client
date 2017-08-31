import React, { Component } from 'react';
import { PropTypes as PT } from 'prop-types';
import { Link } from 'react-router';
import Submissions from './Submissions/Submissions';

class MeasuresWidget extends Component {

  measuresList (measures) {
    if(measures && measures.length) {
      return (
        <div>
          {measures.map((measure, index) => (
            <div key={index} className='measure row list-border list-border-small'>
              <div className="col-sm-8">
                <p className="margin-bottom-none">{this.props.createNewLink(measure.title, measure._id)}</p>
              </div>
              <div className="col-sm-4 text-right">
                {this.props.nextSubmissionDue(measure)}
              </div>
            </div>
          ))}
        </div>
      )
    }
    // No measures, return empty
    return (
      <div className="alert alert-warning">
        <span>No tasks added. <a href="#" onClick={this.props.createDefault}>Import default tasks</a> or {this.props.createNewLink('add some')}!</span>
      </div>
    );
  }

  render () {
    return (
      <div>
        <div className="title">
          <h3>{this.props.headerLink}</h3>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <h4>Upcoming / Past-due <span className="pull-right">
              <Link to='/dashboard/Measures'>See all</Link>
            </span></h4>
            <hr />
            {this.measuresList(this.props.measures)}
          </div>
          <div className="col-sm-6">
            <h4>Recent Task Reports <span className="pull-right">
              <Link to='/dashboard/Submissions'>See all</Link>
            </span></h4>
            <hr />
            <Submissions display="recent" />
          </div>
        </div>
      </div>
    );
  }
}

MeasuresWidget.propTypes = {
  headerLink: PT.object,
  subHeaderLink: PT.object,
  createDefault: PT.func.isRequired,
  createNewLink: PT.func.isRequired,
  measures: PT.array.isRequired,
  nextSubmissionDue: PT.func.isRequired,
};

export default MeasuresWidget;
