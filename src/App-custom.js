import React from 'react';
//import uuid from 'uuid';
//import { createStore } from 'redux';
import reduxStore from './redux';

/*const reducer = combineReducers({
  activeThreadId: activeThreadIdReducer,
  threads: threadsReducer,
});*/

/*function reducer(state, action) {
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

function findThreadIndex(threads, action) {
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
}

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
      ];
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
    }
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
};*/

//const store = createStore(reducer, initialState);
const store = reduxStore;

class App extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }

  render() {
    const state = store.getState();
    //console.log(state);
    const activeThreadId = state.activeThreadId;
    const threads = state.threads;
    const threadIds = state.activeThreadId;
    //const activeThread = threads.find((t) => t.id === activeThreadId);

    const tabs = state.threadIds.map(t => (
      {
        title: t.title,
        active: t.id === activeThreadId,
        id: t.id,
      }
    ));

    return (
      <div className='ui segment'>
        <ThreadTabs tabs={tabs} />
        <Thread thread={threads} tab={activeThreadId} threadIds={threadIds} />
      </div>
    );
  }
}

const Tabs = (props) => (
  <div className='ui top attached tabular menu'>
    {
      props.tabs.map((tab, index) => (
        <div
          key={index}
          className={tab.active ? 'active item' : 'item'}
          onClick={() => props.onClick(tab.id)}
        >
          {tab.title}
        </div>
      ))
    }
  </div>
);

class ThreadTabs extends React.Component {
  render() {
    return (
      <Tabs
        tabs={this.props.tabs}
        onClick={(id) => (
          store.dispatch({
            type: 'OPEN_THREAD',
            id: id,
          })
        )}
      />
    );
  }
}

class MessageInput extends React.Component {
  state = {
    value: '',
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };

  handleSubmit = () => {
    store.dispatch({
      type: 'ADD_MESSAGE',
      text: this.state.value,
      threadId: this.props.activeTab,
      activeTab: this.props.activeTab,
    });
    this.setState({
      value: '',
    });
  };

  render() {
    return (
      <div className='ui input'>
        <input
          onChange={this.onChange}
          value={this.state.value}
          type='text'
        />
        <button
          onClick={this.handleSubmit}
          className='ui primary button'
          type='submit'
        >
          Submit
        </button>
      </div>
    );
  }
}

class Thread extends React.Component {
  handleClick = (id) => {
    if (id > 1) {
      store.dispatch({
        type: 'DELETE_MESSAGE',
        id: id,
      });
    };
  };

  render() {
    const activeTab= this.props.tab;
    //const chatter = this.props.threadIds;
    const messages = this.props.thread.map((t, index) => (
      <div
        className='comment'
        key={index}
        onClick={() => this.handleClick(index)}
      >
        <div className='text'>
          <strong>{t.title}</strong>&nbsp;&nbsp;{t.message.text}
          <span className='metadata'>@{t.message.timestamp}</span>
        </div>
      </div>
    ));

    return (
      <div className='ui center aligned basic segment'>
        <div className='ui comments'>
          {messages}
        </div>
        <MessageInput threadId={this.props.thread.id} activeTab={activeTab} />
      </div>
    );
  }
}

export default App;
