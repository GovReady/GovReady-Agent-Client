import React from 'react';
import { PropTypes as PT } from 'prop-types';

const Panel = () => {
  return (
    <div className="loading-shim widget panel panel-default">
      <div className="panel-body">
        <h4>
          <br />
          <span className="loading-shim-block-small" />
        </h4>
      </div>
      <div className="panel-footer">
        <span className="loading-shim-block-normal" />
      </div>
    </div>
  )
}

export default Panel;