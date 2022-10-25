import {useState, useReducer } from 'react';
import Gun from 'gun';

// initialize gun
// sync with peers using the peer URLs

const gun = Gun({
    peers: [
        'http://localhost:3040/gun'
    ]
});

//create the initial state to hold messages
const initialState = {
    messages: []
};

// create a reducer to update the messages array
function reducer(state, message) {
    return {
        messages: [message, ...state.messages]
    }
}

export default function App() {
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({ 
    name: '', message: ''
  });  

  // initialize the reducer and state for holding the message array
  const [state, dispatch] = useReducer(reducer, initialState);

  // when the app loads, fetch the current messages and load them into the state
  // this also subcribes to new data as it changes an updates and the local state

  useState(() => {
    const messages = gun.get('messages');
    messages.map().once(m => {
      dispatch({
        name: m.name,
        message: m.message,
        createdAt: m.createdAt
      })
    })
  }, []);

  // set a new message in gun, update the local state to reset the form field
  function saveMessage() {
    const messages = gun.get('messages');
    messages.set({
      name: formState.name,
      message: formState.message,
      createdAt: Date.now()
    });
    setForm({ name: '', message: '' });
    window.location.replace("http://localhost:3000/");
  }

  // update the form state when the user types in the form fields
  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value });
  }

  return (
    <div style={{padding: 30}}>
      <input
        onChange={onChange}
        placeholder="Name"
        name="name"
        value={formState.name}
      />
      <input
        onChange={onChange}
        placeholder="Message"
        name="message"
        value={formState.message}
      />
      <button onClick={saveMessage}>Send Message</button>
      {
        state.messages.map(message => (
          <div key={message.createdAt}>
            <h2>--------------------------</h2>
            <h2>Message: {message.message}</h2>
            <h3>From: {message.name}</h3>
            <p>Date: {message.createdAt}</p>        
          </div>
        ))
      }
    </div>
  );
}