import {useEffect, useState, useReducer } from 'react';
import Gun from 'gun';
import Message from './Message';
import SenderLogs from './SenderLogs';
import './App.css';


export default function App() {
  return (
  <>
  <div id="wrapper">
    <div id="first">
    <Message></Message>
    </div>
    <div id="second">
    <SenderLogs></SenderLogs>
    </div>
  </div>
  </>);
}