import {useEffect, useState, useReducer } from 'react';
import Gun from 'gun';
import './SenderLogs.css';
import {ethers} from "ethers";
import * as C from "./contractContact.js";

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

function AddBlockchainData(){
    //const [sender,setReciever] = useState(0);
    //const [sender,setSender] = useState(0);
    //const sender = "0xfC8Bbd2E1868ea18adcBfe9a2Ad698aE55bB9D1B"
    console.log("listner started");

    // fetch the sender contract
    // 
    var [senderAddress,senderAbi] = C.getSenderInfo(C.ethID);
    var senderContractETH = new ethers.Contract(senderAddress,senderAbi,new ethers.providers.JsonRpcProvider(C.ethRPC));
    
    [senderAddress,senderAbi] = C.getSenderInfo(C.binanceID);
    var senderContractBNB = new ethers.Contract(senderAddress,senderAbi,new ethers.providers.JsonRpcProvider(C.binanceRPC));

    [senderAddress,senderAbi] = C.getSenderInfo(C.fantomID);
    var senderContractFTM = new ethers.Contract(senderAddress,senderAbi,new ethers.providers.JsonRpcProvider(C.fantomRPC));

    //listen for message sent from sender
    senderContractETH.on("NewMsg", (msg) => {       
        console.log("Sent Message: " + msg);
        const senderLogs = gun.get('senderLogs');
        senderLogs.set({
            Chain: "Ethereum",
            Message: msg,
            createdAt: Date.now()   
        });
        window.location.replace("http://localhost:3000/");
      });
    
    senderContractBNB.on("NewMsg", (msg) => {
        console.log("Sent Message: " + msg);
        const senderLogs = gun.get('senderLogs');
        senderLogs.set({
            Chain: "Binance",
            Message: msg,
            createdAt: Date.now()
        });
        window.location.replace("http://localhost:3000/");
      });
    
    senderContractFTM.on("NewMsg", (msg) => {
        console.log("Sent Message: " + msg);
        const senderLogs = gun.get('senderLogs');
        senderLogs.set({
            Chain: "Fantom",
            Message: msg,
            createdAt: Date.now()
        });
      });
    /*
    senderContractETH.off("NewMsg");
    senderContractBNB.off("NewMsg");
    senderContractFTM.off("NewMsg");
    */
}

function GetSentData(){
    const sent = gun.get()
}

export default function SenderLogs() {
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({ 
    name: '', message: ''
  });  

  // initialize the reducer and state for holding the message array
  const [state, dispatch] = useReducer(reducer, initialState);

  // when the app loads, fetch the current messages and load them into the state
  // this also subcribes to new data as it changes an updates and the local state

  useState(() => {
    AddBlockchainData();

    const messages = gun.get('senderLogs');
    messages.map().once(m => {
      dispatch({
        Chain: m.Chain,
        Message: m.Message,
        createdAt: m.createdAt
      })
    })

    //const
  }, []);

  // set a new message in gun, update the local state to reset the form field
  function saveMessage() {
    const messages = gun.get('senderLogs');
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
    //window.onload = AddBlockchainData(),
    <div style={{padding: 30}}class="shadowbox">
      <h1>Outgoing</h1>
        {
        state.messages.map(message => (
          <div key={message.createdAt}>
            <h2>------------------------</h2>
            <h2>Logs: {message.Message}</h2>
            <h3>From: {message.Chain}</h3>
            <p>Date: {new Date(message.createdAt).toString()}</p>        
          </div>
        ))
      }
    </div>
  );
}