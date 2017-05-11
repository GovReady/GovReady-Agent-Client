import objectAssign from 'object-assign';
import { hashHistory } from 'react-router';

// var BPromise = require('bluebird');

// ------------------------------------
// Constants
// ------------------------------------

export const MESSAGE_ADD = 'MESSAGE_ADD';
export const MESSAGE_DISMISS = 'MESSAGE_DISMISS';
export const MESSAGE_DISMISS_ALL = 'MESSAGE_DISMISS_ALL';
export const MESSAGES_SEEN = 'MESSAGES_SEEN';

export const messageStates = {
  MESSAGE_ADD,
  MESSAGE_DISMISS,
  MESSAGE_DISMISS_ALL,
  MESSAGES_SEEN
}

// ------------------------------------
// Actions
// ------------------------------------

// Adds message to queue
export function messageAdd (message: object): Action {
  return { type: MESSAGE_ADD, message: message };
}

// Clears single message
export function messageDismiss (message: object): Action {
  return { type: MESSAGE_DISMISS, message: message };
}

// Clears all messages
export function messageDismissAll (): Action {
  return { type: MESSAGE_DISMISS_ALL };
}

// Indicates messages have been seen
export function messagesSeen (): Action {
  return { type: MESSAGES_SEEN };
}

export const actions = {
  messageAdd,
  messageDismiss,
  messageDismissAll,
  messagesSeen
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [MESSAGE_ADD]: (state: object, action: {message: object}): object => {
    return {
      messages: [
        ...state.messages,
        action.message
      ],
      viewed: false
    };
  },
  [MESSAGE_DISMISS]: (state: object, action: {message: object}): object => {
    return {
      messages: state.messages.filter((message) => {
        return message.content !== action.message.content
      }),
      viewed: false,
    };
  },
  [MESSAGE_DISMISS_ALL]: (state: object, action: {}): object => {
    if (!state.viewed) {
      return state;
    }
    return objectAssign({}, initialState);
  },
  [MESSAGES_SEEN]: (state: object, action: {}): object => {
    return objectAssign({}, state, { viewed: true });
  }
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  messages: [],
  false
};

export default function messageReducer (state: object = initialState, action: Action): object {
  const handler = ACTION_HANDLERS[action.type];
  if (handler) {
    return handler(state, action);
  }
  return state;
}
