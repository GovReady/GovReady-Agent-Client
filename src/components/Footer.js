import React, { Component } from 'react';
import config from '../config';


class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }

  componentWillMount() {
    if(config.access_token) {
      fetch(`${config.authUrl}tokeninfo?id_token=${config.access_token}`).then((response) => {
        if(response.status == 200) return response.json();
        else throw new Error('Bad response!');
      }).then((response) => {
          this.setState({
            user: {
              email: response.email,
              nickname: response.nickname
            }
          });
      }).catch(() => {
        console.log('woops');
      });
    }
  }



  render() {
    const { user: { email, nickname } } = this.state;
    return (
      <div className="gov-footer well well-sm well-faint text-center">
        <div className="dash-item dash-connected"><small>Dashboard connected to {config.connectUrl}</small></div>
        <div className="dash-item dash-version">
          <small>Client version: {__VERSION__}</small>
        </div>
        {email && (
          <div className="dash-item dash-logged-in">
            <small>Logged in as {nickname} ({email})</small>
          </div>
        )}
      </div>
    )
  }
}

export default Footer;
  