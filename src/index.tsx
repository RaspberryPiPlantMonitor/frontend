import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeIcons } from '@fluentui/react/lib/Icons';
initializeIcons(); 

const HOST = "10.88.111.26:8080" //window.location.host

let promptCount = 0;
const pwPrompt = (options: any) => {
    return new Promise((resolve, reject) => {
      const lm = options.lm || "Password:",
            bm = options.bm || "Submit";

      const prompt = document.createElement("div");
      prompt.className = "pw_prompt";

      const submit = function() {
          resolve(input.value);
          document.body.removeChild(prompt);
      };

      const label = document.createElement("label");
      label.textContent = lm;
      // @ts-ignore
      label.for = "pw_prompt_input" + (++promptCount);
      prompt.appendChild(label);

      const input = document.createElement("input");
      input.id = "pw_prompt_input" + (promptCount);
      input.type = "password";
      input.addEventListener("keyup", function(e) {
          if (e.keyCode == 13) submit();
      }, false);
      prompt.appendChild(input);

      const button = document.createElement("button");
      button.textContent = bm;
      button.addEventListener("click", submit, false);
      prompt.appendChild(button);

      document.body.appendChild(prompt);
    })
};

pwPrompt({
    lm: "Please enter your password:"
}).then((password) => {
    const websocket = new WebSocket(`ws://${HOST}?password=${password}`);
    websocket.onopen = function (ret) {
      console.log(ret)
      console.log("Websocket connection established");
    };

    websocket.onclose = function () {
      console.log("Websocket disconnected");
      window.location.reload();
    };

    ReactDOM.render(
      <React.StrictMode>
        <App websocket={websocket}/>
      </React.StrictMode>,
      document.getElementById('root')
    );
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
