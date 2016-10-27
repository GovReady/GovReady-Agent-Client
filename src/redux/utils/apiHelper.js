import { hashHistory } from 'react-router';
import {default as config, configUpdateNonce} from 'config';

const apiHelper = {

  // Generates request params
  requestParams: (method, data = {}) => {
    let params = {
      method: method
    }
    // Are we in no-agg direct communication mode?
    if(config.mode === 'agent' || config.mode === 'standalone') {
      params.headers = {
        'Authorization': 'Bearer ' + config.access_token
      };
      if(Object.keys(data).length) {
        // Add form header
        params.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        // Build form params
        const searchParams = Object.keys(data).map((key) => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
        params.body = searchParams;
      }
    }
    // CMS agent
    else {
      // Init nonce
      data.govready_nonce = config.govready_nonce;
      // Add same origin
      params.credentials = 'same-origin';
      if(Object.keys(data).length) {
        let form_data = new FormData();
        for(let key of Object.keys(data)) {
          form_data.append(key, data[key]);
        }
        params.body = form_data;
      }
    }
    return params;
  },
    
  // Checks response, returns json or error
  responseCheck: (response) => {
    let json;
    // Good?
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }
    // Just return error
    let error = new Error(response.statusText);
    error.response = response;
    error.error = response.statusText;
    return error;
  },

  // Checks json for embedded errors
  jsonCheck: (json) => {
    let error = new Error();
    // Some error, so create, and return
    if(json === -1 ) { //!json || typeof json !== 'object' || !json.govready_nonce) {
      hashHistory.push('/reload');
      error.error = "Malformed server response";
    }
    else if(json === 'err: unknown' || (typeof json === 'object' && (json.error || json.err))) {
      error.error = json;
    }
    else {
      // configUpdateNonce(json.govready_nonce);
      return;
    }
    return error;
  }
}

export default apiHelper;