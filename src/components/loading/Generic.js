import React from 'react';
import { PropTypes as PT } from 'prop-types';

const Generic = ({ header = 'h3', rowCount = 3 }) => {
  return (
    <div className="loading-shim widget">
      {React.createElement(
        header, 
        {}, 
        <span className="loading-shim-block-normal" />
      )}
      {[...Array(rowCount)].map((un,i) => (
        <p key={i.toString()}><span className="loading-shim-block-large" /></p>
      ))}
    </div>
  )
}

export default Generic;