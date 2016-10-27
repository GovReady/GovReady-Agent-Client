import objectAssign from 'object-assign';
import { hashHistory } from 'react-router';
import apiHelper from '../utils/apiHelper';
import { Promise as BPromise } from 'bluebird';
import { 
  default as config, 
  configChangeSite, 
  configChangeMode, 
  configCmsPaths,
  configCmsLanguage 
} from 'config';

// var BPromise = require('bluebird');

// ------------------------------------
// Constants
// ------------------------------------

export const SITE_INIT = 'SITE_INIT';
export const SITE_RESET = 'SITE_RESET';
export const SITE_SITES_START = 'SITE_SITES_START';
export const SITE_SITES_SUCCESS = 'SITE_SITES_SUCCESS';
export const SITE_SITES_FAILED = 'SITE_SITES_FAILED';
export const SITE_USER_START = 'SITE_USER_START';
export const SITE_USER_FAILED = 'SITE_USER_FAILED';
export const SITE_PRE_START = 'SITE_PRE_START';
export const SITE_PRE_FAILED = 'SITE_PRE_FAILED';
export const SITE_PING_START = 'SITE_PING_START';
export const SITE_PING_FAILED = 'SITE_PING_FAILED';
export const SITE_MODE_CHANGE_START = 'SITE_MODE_CHANGE_START';
export const SITE_MODE_CHANGE_SUCCESS = 'SITE_MODE_CHANGE_SUCCESS';
export const SITE_MODE_CHANGE_FAILED = 'SITE_MODE_CHANGE_FAILED';
export const SITE_AGG_START = 'SITE_AGG_START';
export const SITE_AGG_FAILED = 'SITE_AGG_FAILED';
export const SITE_LOCAL_AGG_START = 'SITE_LOCAL_AGG_START';
export const SITE_LOCAL_AGG_FAILED = 'SITE_LOCAL_AGG_FAILED';
export const SITE_VULNERABILITY_AGG_START = 'SITE_VULNERABILITY_AGG_START';
export const SITE_VULNERABILITY_AGG_FAILED = 'SITE_VULNERABILITY_AGG_FAILED';
export const SITE_LOADED = 'SITE_LOADED';

export const siteStates = {
  SITE_INIT,
  SITE_RESET,
  SITE_USER_START,
  SITE_USER_FAILED,
  SITE_PRE_START,
  SITE_PRE_FAILED,
  SITE_SITES_START,
  SITE_SITES_SUCCESS,
  SITE_SITES_FAILED,
  SITE_PING_START,
  SITE_PING_FAILED,
  SITE_MODE_CHANGE_START,
  SITE_MODE_CHANGE_SUCCESS,
  SITE_MODE_CHANGE_FAILED,
  SITE_AGG_START,
  SITE_AGG_FAILED,
  SITE_LOCAL_AGG_START,
  SITE_LOCAL_AGG_FAILED,
  SITE_VULNERABILITY_AGG_START,
  SITE_VULNERABILITY_AGG_FAILED,
  SITE_LOADED
}

// ------------------------------------
// Actions
// ------------------------------------

// Changes site status
export function siteReset (): Action {
  return { type: SITE_RESET };
}

// Attempts to attach user
export function siteUserStart (): Action {
  return { type: SITE_USER_START };
}

// Changes site status
export function siteUserFailed (error: object): Action {
  return { type: SITE_USER_FAILED, error: error };
}

// Changes site status
export function sitePreStart (): Action {
  return { type: SITE_PRE_START };
}

// Changes site status
export function sitePreFailed (error: object): Action {
  return { type: SITE_PRE_FAILED, error: error };
}

// Changes site status
export function siteSitesStart (): Action {
  return { type: SITE_SITES_START };
}

// Changes site status, saves sites
export function siteSitesSuccess (sites: array): Action {
  return { type: SITE_SITES_SUCCESS, sites: sites };
}

// Changes site status
export function siteSitesFailed (error: object): Action {
  return { type: SITE_SITES_FAILED, error: error };
}

// Changes site status
export function sitePingStart (): Action {
  return { type: SITE_PING_START };
}

// Changes site status
export function sitePingFailed (error: object): Action {
  return { type: SITE_PING_FAILED, error: error };
}

// Changes site mode
export function siteModeChangeStart (mode: string): Action {
  return { type: SITE_MODE_CHANGE_START, mode: mode };
}

// Changes site mode
export function siteModeChangeSuccess (mode: string): Action {
  return { type: SITE_MODE_CHANGE_SUCCESS, mode: mode };
}

// Changes site status
export function siteModeChangeFailed (mode: string, error: object): Action {
  return { type: SITE_MODE_CHANGE_FAILED, mode: mode, error: error };
}

// Changes site status
export function siteAggStart (): Action {
  return { type: SITE_AGG_START };
}

// Changes site status
export function siteAggFailed (error: object): Action {
  return { type: SITE_AGG_FAILED, error: error };
}

// Changes site status
export function siteVulnerabilityAggStart (): Action {
  return { type: SITE_VULNERABILITY_AGG_START };
}

// Changes site status
export function siteVulnerabilityAggFailed (error: object): Action {
  return { type: SITE_VULNERABILITY_AGG_FAILED, error: error };
}

// // Changes site mode
// export function siteRefreshStart (mode: string): Action {
//   return { type: SITE_REFRESH_START, mode: mode };
// }

// // Changes site status
// export function siteRefreshFailed (mode: string, error: object): Action {
//   return { type: SITE_REFRESH_FAILED, mode: mode, error: error };
// }

// Changes site status
export function siteLoaded (mode: string): Action {
  return { type: SITE_LOADED, mode: mode };
}

// ------------------------------------
// Site mode arrays
// ------------------------------------

// const siteModeActions = {
//   'full': {
//     sitePre: siteUser,
//     siteUser: 
//   }
//   'noagg': {

//   }
// }

// ------------------------------------
// ASYNC Actions
// ------------------------------------

//
// Helper function calls endpoint 
//
export function sitePost (url: string, appendUrl: boolean, data: object, method: string): Function {
  return (dispatch: Function) => {
    let requestMethod = 'POST';
    // Add normal path? (trigger has seperate url)
    if(appendUrl) {
      url = config.apiUrlNoSite + url;
    }
    // Are we in no-agg direct communication mode?
    if(config.mode === 'agent' || config.mode === 'standalone') {
      requestMethod = method;
    }
    else {
      // Append method ?
      if(method) {
        url = url + '&method=' + method;
      }
    }
    // Load data
    return fetch(url, apiHelper.requestParams(requestMethod, data)).then((response: object) => {
      return apiHelper.responseCheck(response);
    }).then((json: object) => {
      const error = apiHelper.jsonCheck(json);
      if(error) {
        return error;
      }
      return json;
    }).catch(function (error) {
      return error;
    });
  };
}

//
// Calls site enpoint
//
export function sitePre( mode: string = config.mode ): Function {
  return (dispatch: Function) => {
    dispatch(sitePreStart());
    return dispatch(sitePost('/sites/' + config.siteId, true, {}, 'GET')
    ).then((res) => {
      if(!(res instanceof Error)) {

        // If we're in read-only mode, go to user
        if(config.mode === 'agent' || config.mode === 'standalone') {
          // We have an application
          if(res.stack && res.stack.application && res.stack.application.platform) {
            // change cms language if available
            configCmsLanguage(res.stack.application.platform.toLowerCase());
            configChangeMode('agent');
          }
          else {
            configChangeMode('standalone');
          }
          dispatch(siteUser());
          return;
        }

        // @TODO Cache all these endpoints
        let allSet = true;
        let endpoints = []; 
        endpoints = [ 'stack', 'accounts', 'plugins'];
        // If we're not in local, check domains
        if(mode === 'remote') {
          endpoints.push('domain');
        }
        endpoints.map((endpoint) => {
          if(res[endpoint]) {
            allSet = allSet;
          } else {
            allSet = false;
          }
        });
        if(allSet || forceDispatch) {
          dispatch(siteLoaded(config.mode ? config.mode : 'remote'));
          return;
        }
      }
      // Someting went wrong, so dispatch failed
      // Then try the ping check
      dispatch(sitePreFailed());
      dispatch(siteUser());
    }).catch((error) => {
      // Someting went wrong, so dispatch failed
      // Then try the ping check
      dispatch(sitePreFailed());
      dispatch(siteUser());
    });
  }
}

//
// Attaches site user 
// @todo make work with proper errors... moving to ping no matter what
// since the enpoint returns 500 if user is already created
//
export function siteUser(): Function {
  return (dispatch: Function) => {
    dispatch(siteUserStart());
    return dispatch(sitePost('/user-site/' + config.siteId, true, {}, 'POST')
    ).then((res) => {
      // @TODO get better response from user
      // We have an error
      // if(res instanceof Error) {
      //   // Dispatch to local mode
      //   dispatch(sitePing());
      //   dispatch(siteUserFailed(res));
      //   return;
      // }
      dispatch(siteUserFailed(res));
      // Catch no-agg modes
      if(config.mode === 'agent' || config.mode === 'standalone') {
        dispatch(siteSites(config.mode));
      }
      // Dispatch post all to get data
      else {
        dispatch(sitePing());
      }
    }).catch((error) => {
      // Dispatch to local mode
      dispatch(siteUserFailed(error));
      dispatch(sitePing());
    });
  }
}

//
// Grabs other user sites
//
export function siteSites(): Function {
  return (dispatch: Function) => {
    dispatch(siteSitesStart());
    return dispatch(sitePost('/sites', true, {}, 'GET')
    ).then((res) => {
      // We have an error
      if(res instanceof Error) {
        // Failed to get all sites, load anyways
        dispatch(siteSitesFailed(res));
        dispatch(siteLoaded(config.mode));
        return;
      }
      // Sites loaded, load page
      dispatch(siteSitesSuccess(res));
      dispatch(siteLoaded(config.mode));
    }).catch((error) => {
      // Failed to get all sites, load anyways
      dispatch(siteSitesFailed(error));
      dispatch(siteLoaded(config.mode));
    });
  }
}

//
// Changes the active site
//
export function siteChangeSite(siteId: string): Function {
  return (dispatch: Function) => {
    configChangeSite(siteId);
    configChangeMode('agent');
    configCmsPaths();
    dispatch(siteReset());
    hashHistory.push('/');
  }
}

//
// Attempts to have exteral server ping this one
//
export function sitePing(): Function {
  return (dispatch: Function) => {
    dispatch(sitePingStart());
    return dispatch(sitePost('/monitor/' + config.siteId + '/ping', true, {}, 'POST')
    ).then((res) => {
      // We have an error
      if(res instanceof Error) {
        // Dispatch to local mode
        dispatch(sitePingFailed(res));
        return;
      }
      // Dispatch post all to get data
      dispatch(siteAggAll());
    }).catch((error) => {
      // Dispatch to local mode
      dispatch(sitePingFailed(error));
    });
  }
}

//
// Changes CMS mode between local / remote
//
export function siteModeChange(mode: string, reset: boolean = '', redirect: string = '') {
  return (dispatch: Function) => {
    dispatch(siteModeChangeStart(mode));
    return dispatch(
      sitePost(config.apiTrigger, false, {
          key: 'changeMode',
          mode: mode,
          siteId: config.siteId
      })
    ).then((res) => {
      // We have an error
      if(res instanceof Error) {
        // Dispatch to local mode
        dispatch(siteModeChangeFailed(mode, res));
        return;
      }
      // Dispatch post all to get data
      dispatch(siteModeChangeSuccess(mode));
      if(reset) {
        dispatch(siteReset());
      }
      if(redirect) {
        hashHistory.push(redirect);
      }
    }).catch((error) => {
      // Dispatch to local mode
      dispatch(siteModeChangeFailed(mode, error));
    });
  }
}

//
// Triggers aggregation in local or remote mode
//
export function siteAggAll(mode: string): Function {
  return (dispatch: Function) => {
    let calls;
    // Local mode
    if(mode === 'local') {
      calls = [
        {
          url: config.apiTrigger,
          data: {
            key: 'changeMode',
            mode: 'local',
            siteId: config.siteId
          }
        },
        {
          url: config.apiTrigger,
          data: {
            key: 'stack',
            endpoint: 'stack',
            siteId: config.siteId
          }
        },
        {
          url: config.apiTrigger,
          data: {
            key: 'accounts',
            endpoint: 'accounts',
            siteId: config.siteId
          }
        },
        {
          url: config.apiTrigger,
          data: {
            key: 'plugins',
            endpoint: 'plugins',
            siteId: config.siteId
          }
        },
      ];
    }
    // Remote mode
    else {
      calls = [
        {
          url: config.apiTrigger,
          data: {
            key: 'changeMode',
            mode: 'remote',
            siteId: config.siteId
          }
        },
        {
          url: '/monitor/' + config.siteId + '/stack',
          data: {},
          appendUrl: true
        },
        {
          url:  '/monitor/' + config.siteId + '/domain',
          data: {},
          appendUrl: true
        },
        {
          url: '/monitor/' + config.siteId + '/accounts',
          data: {},
          appendUrl: true
        },
        {
          url: '/monitor/' + config.siteId + '/plugins',
          data: {},
          appendUrl: true
        },
      ];
    }

    dispatch(siteAggStart());
    return BPromise.each(calls, (call) => {
      return dispatch(sitePost(call.url, call.appendUrl, call.data, call.method));
    }).then((returns) => {
      let error;
      // Check Agg results for errors
      returns.map((returnItem) => {
        if(returnItem.error) {
          error = returnItem.error;
        }
      });
      // we had some errors ?
      if(error) {
        // Dispatch failed
        dispatch(siteAggFailed(error));
      }
      else {
        // Aggregate vulnerabilities
        dispatch(siteVulnerabilityAgg(mode));
      }
      
    })
    .catch((error) => {
      // Dispatch Failed
      dispatch(siteAggFailed(error));
    });
  }
}

//
// Triggers vulnerability compilation
//
export function siteVulnerabilityAgg(mode: string): Function {
  return (dispatch: Function) => {
    dispatch(siteVulnerabilityAggStart());
    return dispatch(sitePost(config.apiUrl + 'vulnerabilities', false, {}, 'GET')
    ).then((res) => {
      // We have an error
      if(res instanceof Error) {
        // Dispatch to local mode
        dispatch(siteVulnerabilityAggFailed(res));
        return;
      }
      // Dispatch post all to get data
      dispatch(siteLoaded(mode));
    }).catch((error) => {
      // Dispatch to local mode
      dispatch(siteVulnerabilityAggFailed(error));
    });
  }
}

// export function siteRefreshData(): Function {
//   calls = [
//     {
//       url: config.apiTrigger,
//       data: {
//         key: 'stack',
//         endpoint: 'stack',
//         siteId: config.siteId
//       }
//     },
// }

export const actions = {
  siteReset,
  sitePre,
  sitePing,
  siteModeChange,
  siteAggAll,
  siteVulnerabilityAgg,
  siteChangeSite
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const actionHandler = (
  state: object, 
  action: {
    type: string,
    mode: string, 
    error: object
  }
) => {
  // Init or interim call
  if(action.type === SITE_MODE_CHANGE_START) {
    return state;
  }
  // if reset set to init
  let newState = {
    'status': action.type === SITE_RESET ? SITE_INIT : action.type
  }
  // Sites? 
  if(action.sites && action.sites.length) {
    newState['sites'] = action.sites;
  }
  // Action?
  if(action.mode) {
    newState['mode'] = action.mode;
  }
  // Error?
  if(action.error) {
    newState['error'] = action.error;
  }
  return objectAssign({}, state, newState);
}

// ------------------------------------
// Helper
// ------------------------------------

export function isSiteLoaded(globalState) {
  return globalState.siteState && globalState.siteState.status === SITE_LOADED;
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  status: SITE_INIT,
  mode: config.mode,
  sites: []
};

export default function siteReducer (state: object = initialState, action: Action): object {
  if(!siteStates[action.type]) {
    return state;
  }
  return actionHandler(state, action);
}
