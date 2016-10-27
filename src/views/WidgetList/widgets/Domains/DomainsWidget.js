import React, { Component, PropTypes as PT } from 'react';

class DomainsWidget extends Component {

  render () {
    let { ssl, nextExpires, footer } = this.props;
    return (
      <div className='panel panel-default'>
        <div className='panel-body'>
          <h4>
            {nextExpires && ( 
              <div>{nextExpires}</div>
            )}
            <br/>
            <small>Next domain renewal</small>
            {(!ssl || !ssl.domain) && (
              <div>
                <span className="label label-danger">No SSL active</span>
              </div>
            )}
          </h4>
        </div>
        {footer}
      </div>
    );
  }
}

DomainsWidget.propTypes = {
  nextExpires: PT.string,
  ssl: PT.object,
  footer: PT.object.isRequired
};


export default DomainsWidget;
