import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeIcons } from '@fluentui/react/lib/Icons';
initializeIcons(); 

const HOST = "10.88.111.26:8080" //window.location.host

const websocket = new WebSocket("ws://" + HOST + "/video");
websocket.onopen = function () {
    console.log("Websocket connection established");
};

websocket.onclose = function () {
    console.log("Websocket disconnected");
};

const img = new Image() 

websocket.onmessage = function (message) {
  img.src = message.data;
};

ReactDOM.render(
  <React.StrictMode>
    <App camera_img={img} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
