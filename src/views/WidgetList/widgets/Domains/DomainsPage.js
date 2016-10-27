import React, { Component, PropTypes as PT } from 'react';
import Accordion from 'react-bootstrap/lib/Accordion';
import Panel from 'react-bootstrap/lib/Panel';
import { Link } from 'react-router';

class DomainsPage extends Component {

  render () {
    let { header, domains, ssl } = this.props;
    return (
      <div>
        {header}
        <hr/>
        <p>Information about your site domain and SSL certificate can be found below.  It's important to keep track of who has the information necessary to update and renew.</p> 
        <p><Link className="btn btn-default btn-sm" to={'/dashboard/Contacts/'} >Go to contacts</Link></p>
        <hr/>
        <h3>Domains</h3>
        <div className='domains'>
          {domains.map((domain, index) => (
            <div key={index}>
              <p><strong>Domain:</strong><span> {domain.domain}</span></p>
              <p><strong>Expires:</strong><span>  {domain.expires}</span></p>
              <Accordion>
                <Panel header="Show whois record" eventKey={'whois-' + index}>
                  <pre>{domain.whois}</pre>
                </Panel>
              </Accordion>
            </div>
          ))}
        </div>
        <div>
          <h3>SSL</h3>
          {!ssl.domain && (
            <p className="alert alert-danger">No SSL active</p>
          )}
          {ssl.domain && (
            <div>
              <p><strong>Domain:</strong><span>  {ssl.domain}</span></p>
              <p><strong>Expires:</strong><span>  {ssl.expires}</span></p>
              <p><strong>Issued by:</strong><span>  {ssl.issuedBy}</span></p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

DomainsPage.propTypes = {
  header: PT.object.isRequired,
  domains: PT.array.isRequired,
  ssl: PT.object.isRequired
};

export default DomainsPage;
