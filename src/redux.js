import uuid from 'uuid';
import { createStore } from 'redux';

/*const reducer = combineReducers({
  activeThreadId: activeThreadIdReducer,
  threads: threadsReducer,
});*/

function reducer(state, action) {
  return {
    activeThreadId: activeThreadIdReducer(state.activeThreadId, action),
    threadIds: [
      {
        id: '1-fca2',
        title: 'Buzz Aldrin',
      }, 
      {
        id: '2-be91',
        title: 'Michael Collins',
      }
    ],
    threads: threadsReducer(state.threads, action),
  };
}

function activeThreadIdReducer(state = '1-fca2', action) {
  if (action.type === 'OPEN_THREAD') {
    return action.id;
  } else {
    return state;
  }
}

/*function findThreadIndex(threads, action) {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      return threads.findIndex(
        (t) => t.id === action.threadId
      );
    }
    case 'DELETE_MESSAGE': {
      return threads.findIndex(
        (t) => t.messages.find((m) => (
          m.id === action.id
        ))
      );
    }
  }
}*/

function threadsReducer(state = [
  {
    id: '1-fca2',
    title: 'Buzz Aldrin',
    message: messageReducer(undefined, {}),
  },
  {
    id: '2-be91',
    title: 'Michael Collins',
    message: messageReducer(undefined, {}),
  },
], action) {
  switch (action.type) {
    case 'ADD_MESSAGE': {
    //case 'DELETE_MESSAGE': {
      //const threadIndex = findThreadIndex(state, action);

      const oldThread = state;
      const newThread = {
        id: action.threadId,
        title: activeTitle(state, action),
        message: messageReducer(undefined, action),
      };

      /*return [
        ...state.slice(0, threadIndex),
        newThread,
        ...state.slice(
          threadIndex + 1, state.length
        ),
      ];*/
      return oldThread.concat(newThread);
    }
    case 'DELETE_MESSAGE': {
      return state.filter((m, index) => index !== action.id);
    }
    default: {
      return state;
    }
  }
}

function activeTitle(state, action) {
  //console.log(action);
  let val = state.filter(st => st.id === action.activeTab);
  //console.log(val);
  if(action.type === 'ADD_MESSAGE') {
    return val[0].title;
  }
}

function messageReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      const newMessage = {
        text: action.text,
        timestamp: Date.now(),
        id: uuid.v4(),
      };
      //return state.concat(newMessage);
      return {
        ...state,
        ...newMessage,
      }
    }
    /*case 'DELETE_MESSAGE': {
      return state.filter(m => m.id !== action.id);
    }*/
    default: {
      return state;
    }
  }
}

const initialState = {
  activeThreadId: '1-fca2',
  threadIds: [
    {
      id: '1-fca2',
      title: 'Buzz Aldrin',
    }, 
    {
      id: '2-be91',
      title: 'Michael Collins',
    }
  ],
  threads: [
    {
      id: '1-fca2',
      title: 'Buzz Aldrin',
      message: {
        text: 'Twelve minutes to ignition.',
        timestamp: Date.now(),
        id: uuid.v4(),
      },
    },
    {
      id: '2-be91',
      title: 'Michael Collins',
      message: {},
    },
  ],
};

const reduxStore = createStore(reducer, initialState);

export default reduxStore;