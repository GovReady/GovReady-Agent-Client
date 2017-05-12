import React, { PropTypes as PT } from 'react';
import SiteList from 'views/SiteState/SiteList';
import Footer from 'components/Footer';
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
function CoreLayout ({ children, footer }) {
  return (
    <div id="govready-container" className="page-container govready-container">
      <div className="view-container container">
        <div className="content-container">
          <SiteList offCanvas={true} />
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}

CoreLayout.propTypes = {
  children: PT.element,
  footer: PT.element
};

export default CoreLayout;
