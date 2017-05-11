import objectAssign from 'object-assign';
import apiHelper from '../utils/apiHelper';
import { default as config } from 'config';

// ------------------------------------
// Constants
// ------------------------------------

export const WIDGET_IMPORTED = 'WIDGET_IMPORTED';
export const WIDGET_CLEAR_DATA = 'WIDGET_CLEAR_DATA';
export const WIDGET_LOADING = 'WIDGET_LOADING';
export const WIDGET_LOADED = 'WIDGET_LOADED';
export const WIDGET_LOAD_FAILED = 'WIDGET_LOAD_FAILED';

// ------------------------------------
// Actions
// ------------------------------------

// Fired when widgets are ready
export function widgetImported (widgetName: string): Action {
  return { type: WIDGET_IMPORTED, widgetName: widgetName };
}

export function widgetClearData (widgetName: string): Action {
  return { type: WIDGET_CLEAR_DATA };
}

// Fired when individual widget fetching data
export function widgetLoading (widgetName: string): Action {
  return { type: WIDGET_LOADING, widgetName: widgetName };
}

// Fired when widget has data
export function widgetLoaded (widgetName: string, data: object): Action {
  return { type: WIDGET_LOADED, widgetName: widgetName, data: data };
}

// Fired when widget has data
export function widgetLoadFailed (widgetName: string, error: object): Action {
  return { type: WIDGET_LOAD_FAILED, widgetName: widgetName, error: error };
}

// Fired when widget should get data
export function widgetLoadData (widgetName: string, url: string, processData: Function): Function {
  return (dispatch: Function) => {
    // Call loading action
    dispatch(widgetLoading(widgetName));
    // Add API settings to call
    url = config.apiUrl + url;
    // Load data
    return apiHelper.fetch(url, 'GET').then((json: object) => {
      const error = apiHelper.jsonCheck(json);
      if(error) {
        dispatch(widgetLoadFailed(widgetName, json));
      }
      else {
        const data = processData(json);
        // Call loaded action
        dispatch(widgetLoaded(widgetName, data));
      }
    }).catch(function (error) {
      dispatch(widgetLoadFailed(widgetName, error));
    });
  };
}

export const actions = {
  widgetImported,
  widgetLoading,
  widgetLoaded,
  widgetClearData,
  widgetLoadData,
  widgetLoadFailed
};

// ------------------------------------
// Action Handlers
// ------------------------------------

const initialState = {
  widgets: {}
};

const assignWidgetState = (state, widgetName, widget) => {
  let newWidget = {};
  newWidget[widgetName] = widget;
  return {
    widgets: objectAssign({}, state.widgets, newWidget)
  };
}

const ACTION_HANDLERS = {
  [WIDGET_IMPORTED]: (state: object, action: {widgetName: string, widgetInit: object}): object => {
    const widget = {
      name: action.widgetName,
      status: 'init',
      data: {}
    }
    return assignWidgetState(state, action.widgetName, widget);
  },
  [WIDGET_CLEAR_DATA]: (state: object, action: {}): object => {
    return initialState
  },
  [WIDGET_LOADING]: (state: object, action: {widgetName: string}): object => {
    let widget = objectAssign({}, state.widgets[action.widgetName], {
      'status': 'loading'
    });
    return assignWidgetState(state, action.widgetName, widget);
  },
  [WIDGET_LOADED]: (state: object, action: {widgetName: string, data: object}): object => {
    let widget = objectAssign({}, state.widgets[action.widgetName], {
      'status': 'loaded'
    });
    if(action.data) {
      widget.data = action.data
    }
    return assignWidgetState(state, action.widgetName, widget);
  },
  [WIDGET_LOAD_FAILED]: (state: object, action: {widgetName: string, error: object}): object => {
    let widget = objectAssign({}, state.widgets[action.widgetName], {
      'status': 'load_failed',
      'error': action.error
    });
    return assignWidgetState(state, action.widgetName, widget);
  }
};

// ------------------------------------
// Reducer
// ------------------------------------

export default function widgetReducer (state: object = initialState, action: Action): object {
  const handler = ACTION_HANDLERS[action.type];
  if (handler) {
    return handler(state, action);
  }
  return state;
}
