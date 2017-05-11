import objectAssign from 'object-assign';
import { default as config } from 'config';
import apiHelper from '../utils/apiHelper';
import {
  crudActionTypes, 
  crudSyncActions, 
  crudAsyncActions, 
  crudActionHandlers
} from '../utils/crudFactory';

// ------------------------------------
// Constants
// ------------------------------------

export const actionTypes = crudActionTypes('SUBMISSIONS');

// ------------------------------------
// Actions
// ------------------------------------

const syncActions =  crudSyncActions(actionTypes);
const asyncActions = crudAsyncActions(syncActions);
export const actions = objectAssign({}, syncActions, asyncActions);

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