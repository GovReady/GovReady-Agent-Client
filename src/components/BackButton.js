import React, { PropTypes as PT } from 'react';
import { hashHistory, Link } from 'react-router';

// Creates dynamic back button
const BackButton = ({text = 'Back', classes = 'back btn btn-primary pull-right', backUrl = ''}) => {
  
  // Flick function
  const backClick = (event) => {
    event.preventDefault();
    //@TODO currently no way to do this????
    // Just override with back url
    if(backUrl) {
      hashHistory.push(backUrl);
    }
    // Attempt a "smart back"
    else {
      const currentHash = window.location.hash;
      hashHistory.goBack();
      setTimeout(() => {
        if(currentHash === window.location.hash) {
          hashHistory.push(backUrl);
        }
      }, 0);
    }
  }
  return (
    <Link to="/" className={classes} onClick={backClick}>{text}</Link>
  );
}

BackButton.propTypes = {
  text: PT.string,
  classes: PT.string,
  backUrl: PT.string
}

export default BackButton;

