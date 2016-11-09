import objectAssign from 'object-assign';
import { default as config } from 'config';
import apiHelper from '../utils/apiHelper';
import {
  crudActionTypes, 
  crudSyncActions, 
  crudAsyncActions, 
  crudActionHandlers
} from '../utils/crudHelper';

// ------------------------------------
// Constants
// ------------------------------------

export const actionTypes = crudActionTypes('MEASURES');

// ------------------------------------
// Actions
// ------------------------------------

const syncActions =  crudSyncActions(actionTypes);
const asyncActions = crudAsyncActions(syncActions);
export const actions = objectAssign(syncActions, asyncActions, {
  importDefault: function (url: string): Function {
    return (dispatch: Function) => {
      const failed = (error) => {
        dispatch(syncActions.fetchError(error));
      }
      dispatch(syncActions.fetchStart());
      // Post create
      return apiHelper.fetch(url, 'POST', {
        'siteId': config.siteId
      }).then((json: object) => {
        const error = apiHelper.jsonCheck(json);
        if(error) {
          return failed(error);
        }
        if(json && !json.error) {
          dispatch(asyncActions.fetchRemote(config.apiUrl + 'measures'));
        }
        else {
          failed(json);
        }
      }).catch(function (error) {
        failed(error);
      });
    };
  }
});

// ------------------------------------
// Action Handlers
// ------------------------------------

const actionHandlers = crudActionHandlers(actionTypes);

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = [];

export default function reducer (state: object = initialState, action: Action): object {
  const handler = actionHandlers[action.type];
  if (handler) {
    return handler(state, action);
  }
  return state;
}
