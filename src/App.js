import React from 'react';
import { createStore, combineReducers } from 'redux';
import uuid from 'uuid';
import { Provider, connect } from 'react-redux';

/**
function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  const subscribe = (listener) => (
    listeners.push(listener)
  );

  const getState = () => (state);

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(l => l());
  };

  return {
    subscribe,
    getState,
    dispatch,
  };
}
*/

const reducer = combineReducers({
  activeThreadId: activeThreadIdReducer,
  threads: threadsReducer,
});

function activeThreadIdReducer(state = '1-fca2', action) {
  if (action.type === 'OPEN_THREAD') {
    return action.id;
  } else{
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
      messages: messagesReducer(undefined, {}),
    },
    {
      id: '2-be91',
      title: 'Michael Collins',
      messages: messagesReducer(undefined, {}),
    },
  ], action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
    case 'DELETE_MESSAGE': {
      const threadIndex = findThreadIndex(state, action);
      const oldThread = state[threadIndex];
      const newThread = {
        ...oldThread,
        messages: messagesReducer(oldThread.messages, action),
      };
      
      return [
        ...state.slice(0, threadIndex),
        newThread,
        ...state.slice(
          threadIndex + 1, state.length
        ),
      ];
    }
    default: {
      return state;
    }
  }
}

function messagesReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      const newMessage = {
        text: action.text,
        timestamp: Date.now(),
        id: uuid.v4(),
      };
      return state.concat(newMessage);
    } 
    case 'DELETE_MESSAGE': {
      return state.filter(m => m.id !== action.id);
    }
    default: {
      return state;
    }
  }
}

const initialState = { 
  activeThreadId: '1-fca2',
  threads: [
    {
      id: '1-fca2',
      title: 'Buzz Aldrin',
      messages: [
        {
          text: 'Twelve minutes to ignition.',
          timestamp: Date.now(),
          id: uuid.v4(),
        },
      ],
    },
    {
      id: '2-be91',
      title: 'Michael Collins',
      messages: [],
    },
  ],
};

const store = createStore(reducer);

function deleteMessage(id) {
  return {
    type: 'DELETE_MESSAGE',
    id: id,
  };
}

function addMessage(text, threadId) {
  return {
    type: 'ADD_MESSAGE',
    text: text,
    threadId: threadId,
  }
}

function openThread(id) {
  return {
    type: 'OPEN_THREAD',
    id: id,
  };
}

/*class App extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }

  render() {
    //const messages = store.getState().messages;
    const state = store.getState();
    const activeThreadId = state.activeThreadId;
    const threads = state.threads;
    const activeThread = threads.find((t) => t.id === activeThreadId);

    const tabs = threads.map(t => (
      { 
        title: t.title,
        active: t.id === activeThreadId,
        id: t.id,
      }
    ));

    return (
      <div className='ui segment'>
        <ThreadTabs tabs={tabs} />
        <Thread thread={activeThread} />
      </div>
    );
  }
}*/

const App = () => (
  <div className='ui segment'>
    <ThreadTabs />
    <ThreadDisplay />
  </div>
);

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

/*class ThreadTabs extends React.Component {
  handleClick = (id) => {
    store.dispatch({
      type: 'OPEN_THREAD',
      id: id,
    })
  }

  render() {
    const tabs = this.props.tabs.map((tab, index) => (
      <div
        key={index}
        className={tab.active ? 'active item' : 'item'}
        onClick={() => this.handleClick(tab.id)}
      >
        {tab.title}
      </div>
    ));
    
    const state = store.getState();

    const tabs = state.threads.map(t => (
      {
        title: t.title,
        active: t.id === state.activeThreadId,
        id: t.id,
      }
    ));

    return (
      <div className='ui top attached tabular menu'>
        {tabs}
      </div>
      <Tabs
        tabs={tabs}
        onClick={(id) => (
          store.dispatch({
            type: 'OPEN_THREAD',
            id: id,
          })
        )} />
    );
  }

  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }
}*/

class TextFieldSubmit extends React.Component {
  state = {
    value: '',
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };

  handleSubmit = () => {
    /*store.dispatch({
      type: 'ADD_MESSAGE',
      text: this.state.value,
      threadId: this.props.threadId,
    });*/
    this.props.onSubmit(this.state.value);
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
          type='text' />
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

const MessageList = (props) => (
  <div className='ui comments'>
    {
      props.messages.map((m, index) => (
        <div
          className='comment'
          Key={index}
          onClick={() => props.onClick(m.id)}
        >
          <div className='text'>
            {m.text}
            <span className='metadata'>@{m.timestamp}</span>
          </div>
        </div>
      ))
    }
  </div>
);

const Thread = (props) => (
  <div className='ui center aligned basic segment'>
    <MessageList
      messages={props.thread.messages}
      onClick={props.onMessageClick} />
    <TextFieldSubmit 
      onSubmit={props.onMessageSubmit} />
  </div>
);

const mapStateToTabsProps = (state) => {
  const tabs = state.threads.map(t => (
    {
      title: t.title,
      active: t.id === state.activeThreadId,
      id: t.id,
    }
  ));

  return {
    tabs,
  };
};

const mapDispatchtoTabsProps = (dispatch) => (
  {
    onClick: (id) => (
      dispatch(openThread(id))
    ),
  }
);

const ThreadTabs = connect(
  mapStateToTabsProps,
  mapDispatchtoTabsProps
)(Tabs);

const mapStateToThreadProps = (state) => (
  {
    thread: state.threads.find(
      t => t.id === state.activeThreadId
    ),
  }
);

const mapDispatchToThreadProps = (dispatch) => (
  {
    onMessageClick: (id) => (
      dispatch(deleteMessage(id))
    ),
    dispatch: dispatch,
  }
);

const mergeThreadProps = (stateProps, dispatchProps) => (
  {
    ...stateProps,
    ...dispatchProps,
    onMessageSubmit: (text) => (
      dispatchProps.dispatch(
        addMessage(text, stateProps.thread.id)
      )
    ),
  }
);

const ThreadDisplay = connect(
  mapStateToThreadProps,
  mapDispatchToThreadProps,
  mergeThreadProps
)(Thread);

/*class ThreadDisplay extends React.Component {
  /*handleClick = (id) => {
    store.dispatch({
      type: 'DELETE_MESSAGE',
      id: id,
    });
  };

  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }

  render() {
    const messages = this.props.thread.messages.map((message, index) => (
      <div
        className='comment'
        key={index}
        onClick={() => this.handleClick(message.id)}
      >
        <div className='text'>
          {message.text}
          <span className='metadata'>@{message.timestamp}</span>
        </div>
      </div>
    ));
    
    const state = store.getState();
    const activeThreadId = state.activeThreadId;
    const activeThread = state.threads.find(
      t => t.id === activeThreadId
    );

    return (
      <div className='ui center aligned basic segment'>
        <div className='ui comments'>
          {messages}
        </div>
        <MessageInput threadId={this.props.thread.id} />
      </div>
      <Thread
        thread={activeThread}
        onMessageClick={(id) => (
          store.dispatch({
            type: 'DELETE_MESSAGE',
            id: id,
          })
        )}
        onMessageSubmit={(text) => (
          store.dispatch({
            type: 'ADD_MESSAGE',
            text: text,
            threadId: activeThreadId,
          })
        )} />
    );
  }
}*/

const WrappedApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default WrappedApp;
