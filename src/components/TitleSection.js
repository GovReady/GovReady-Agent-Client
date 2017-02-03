import React, { PropTypes as PT } from 'react';
import { hashHistory, Link } from 'react-router';
import BackButton from 'components/BackButton';

// Creates page header section
const TitleSection => ({text, pageUrl = '', header = 'h3', absolute = false, backlink = false, overrideUrl = '/dashboard'}) {
  // Builds inner content
  const headerInner = () => {
    if(pageUrl && !absolute) {
      return (
        <Link className='title-text' to={`/dashboard/${pageUrl}`}>
          {text}
        </Link>
      )
    }
    else if(pageUrl) {
      return (
        <a className='title-text' href={pageUrl} target="_blank">
          {text}
        </a>
      )
    }
    else if(backlink) {
      return (
        <span>
          <span>{text}</span>
          <BackButton text='Back' classes='back btn btn-primary pull-right' backUrl={overrideUrl} />
        </span>
      )
    }
    else {
      return text;
    }
  } 
  return (
    <div className='title'>
      {React.createElement(header, {}, headerInner())}
    </div>
  );
}

TitleSection.propTypes = {
  text: PT.string.isRequired, // Text inside header
  pageUrl: PT.string, // Optional URL if header is a link
  header: PT.string, // h1, h2, h3
  absolute: PT.bool, // If pageUrl should navigate in dashboard, or is a external link
  backlink: PT.bool, // Show a back button?
  overrideUrl: pt.string // Override the back button url
}

export default TitleSection;