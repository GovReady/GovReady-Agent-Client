import React from 'react';

const reloadPage = () => { 
  document.location.reload(true);
}

const AccessDenied = () => {
  return (
    <div className="empty-page">
      <h2>Looks like this page is out of date.</h2>
      <p>
        Please <a href="#" onClick={reloadPage}>reload the page</a>
      </p>
    </div>
  )
}

export default AccessDenied;