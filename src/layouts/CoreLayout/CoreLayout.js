import React, { PropTypes as PT } from 'react';
import { default as config } from 'config';
import SiteList from 'views/SiteState/SiteList';
import '../../styles/bootstrap-partial.scss';
import '../../styles/core.scss';


// Note: Stateless/function components *will not* hot reload!
// react-transform *only* works on component classes.
//
// Since layouts rarely change, they are a good place to
// leverage React's new Stateless Functions:
// https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
//
// CoreLayout is a pure function of its props, so we can
// define it with a plain javascript function...
function CoreLayout ({ children }) {
  return (
    <div className='page-container govready-container'>
      <div className='view-container container'>
        <div className="content-container">
          <SiteList offCanvas={true} />
          {children}
        </div>
        <p className="gov-footer well well-sm well-faint text-center">
          <small>Dashboard connected to {config.connectUrl}</small>
        </p>
      </div>
    </div>
  );
}

CoreLayout.propTypes = {
  children: PT.element
};

export default CoreLayout;
