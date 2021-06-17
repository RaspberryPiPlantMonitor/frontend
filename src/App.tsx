import { useState, useEffect } from 'react';
import axios from "axios";
import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { DefaultPalette } from '@fluentui/react/lib/Styling';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { ProgressIndicator, IProgressIndicatorStyles  } from '@fluentui/react/lib/ProgressIndicator';
import { SpinButton, ISpinButtonStyles } from '@fluentui/react/lib/SpinButton';
import Canvas from './Canvas';
import plantImage from './assets/plant.png'
import './App.css'; 

// Tokens definition
const outerStackTokens: IStackTokens = { childrenGap: 5 };
const innerStackTokens: IStackTokens = {
  childrenGap: 10,
  padding: 10,
};

// Styles definition
const stackStyles: IStackStyles = {
  root: {
    background: DefaultPalette.themeTertiary,
    height: 340,
  },
};

const innerStackStyles: IStackStyles = {
  root: {
    background: DefaultPalette.themeTertiary,
  },
};

const stackItemStyles: IStackItemStyles = {
  root: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexFlow: 'column'
  },
};

const innerStackItemStyles: IStackItemStyles = {
  root: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexFlow: 'column',
    borderBottom: `1px solid ${DefaultPalette.blueDark}`,
    paddingBottom: "2%"
  }
};


const customSpacingStackTokens: IStackTokens = {
  childrenGap: '1%',
  padding: 's1 1%',
};

const plantImageStyle = {
  width: "50px"
}

const spinButtonStyles: Partial<ISpinButtonStyles> = { 
  arrowButtonsContainer: {
    background: DefaultPalette.white,
  },
  label: {
    color: DefaultPalette.blueDark,
  },
};

const loadingStackStyles: Partial<IStackStyles> = { 
  root: { 
        margin: "auto",
        width: "40%",
        padding: "10px",
        border: "2px solid rgb(0, 120, 212)",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    } 
}; 
const loadingStackTokens: IStackTokens = { childrenGap: 40 };

const progressIndicatorStyles: IProgressIndicatorStyles = {
  itemDescription: {
    fontSize: "15px"
  },
  itemName: {
    fontSize: "20px"
  },
  itemProgress: {},
  progressBar: {
    height: "10px"
  },
  progressTrack: {
    height: "10px"
  }, 
  root: {}
}

const cameraImage = new Image() 

const HOST = window.location.host //"1e59fe277944.ngrok.io" // "10.88.111.26:8080" 

axios.defaults.baseURL = `https://${HOST}`;

function App(props: any) {
  const password = props.password;
  const [humiditySensor, setHumiditySensor] = useState("");
  const [humiditySensorLimit, setHumiditySensorLimit] = useState("0");

  const [lightStatus, setLightStatus] = useState();
  const [pumpStatus, setPumpStatus] = useState();

  useEffect(() => {
    const websocket = new WebSocket(`wss://${HOST}/realtime?password=${password}`); 
    websocket.onopen = function () {
      console.log("Websocket connection established");
    };
  
    websocket.onclose = function () {
      console.log("Websocket disconnected");
      window.location.reload();
    };

    websocket.onmessage = function (message: any) {
      
      // Check if socket is sending camera image
      if (message.data.startsWith("data:image")) cameraImage.src = message.data;
      else {
        try {
          const data = JSON.parse(message.data);
          setHumiditySensor(data.humidityValue);
          setLightStatus(data.lightValue);
          setPumpStatus(data.pumpValue);
        } catch(e) {
        }
      }
    };

    axios.get(`/humiditySensorLimit?password=${password}`).then(response => {
      setHumiditySensorLimit(response.data.value)
    })

  }, [password]);

  const draw = (canvas: any) => {
    const context = canvas.getContext("2d");
    context.font = "20px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";

    cameraImage.onload = function () {
      canvas.width = cameraImage.width
      canvas.height = cameraImage.height
      context.drawImage(cameraImage, 0, 0, cameraImage.width, cameraImage.height);
    };

    cameraImage.onerror = function () {
      context.fillText("Video failed to load!", canvas.width/2, canvas.height/2);
    }
    if (cameraImage.src === "") {
      context.fillText("Loading video...", canvas.width/2, canvas.height/2);
    }
  }

  // Do not render page if sensor data is not ready
  if (humiditySensor === "") {
    return(
      <Stack tokens={loadingStackTokens} styles={loadingStackStyles}>
        <ProgressIndicator label="Wait, wait..." description="Making magic happen :)" styles={progressIndicatorStyles}/>
      </Stack>
    ) 
  }

  return (
    <div className="App">
      <Stack tokens={outerStackTokens}>
        <Stack styles={stackStyles} tokens={innerStackTokens}>
          <Stack.Item grow styles={stackItemStyles}>
            <h1>
              <img src={plantImage} style={plantImageStyle} alt="Plant Monitor" />
              Plant Monitor
              <img src={plantImage} style={plantImageStyle} alt="Plant Monitor" />
            </h1>
          </Stack.Item>
          <Stack.Item grow styles={stackItemStyles}>
            <Canvas draw={draw} />
          </Stack.Item>
          <Stack.Item grow styles={stackItemStyles}>
            <Stack styles={innerStackStyles} tokens={customSpacingStackTokens}>
              <Stack.Item grow styles={innerStackItemStyles}>
                <h3>Humidity Sensor Value:</h3><h2>{humiditySensor}</h2>
                <SpinButton
                  label="Run pump when humidity greater than:"
                  value={humiditySensorLimit}
                  onChange={(_, newValue) => { setHumiditySensorLimit(newValue || "")}}
                  min={0}
                  step={1}
                  incrementButtonAriaLabel="Increase value by 1"
                  decrementButtonAriaLabel="Decrease value by 1"
                  styles={spinButtonStyles}
                />
                <br/>
                <DefaultButton text="Save" onClick={async () => {
                  await axios.post(`/humiditySensorLimit?password=${password}`, {
                    Value: Number(humiditySensorLimit)
                  });
                  alert("Saved!")
                }}/>
              </Stack.Item>
              <Stack.Item grow styles={innerStackItemStyles}>
                <h3>Light Status:</h3><h2>{lightStatus === 0 ? "Off" : "On"}</h2>
                <DefaultButton text={`Turn light ${lightStatus === 0 ? "on" : "off" }`} onClick={async () => {
                  await axios.post(`/lightRelay?password=${password}`, {
                    Value: lightStatus === 0 ? "on" : "off"
                  });
                }} />  
              </Stack.Item>
              <Stack.Item grow styles={innerStackItemStyles}>
                <h3>Water Pump Status:</h3><h2>{pumpStatus === 0 ? "Off" : "On"}</h2>
                {pumpStatus === 0 ? 
                  <DefaultButton text={`Turn pump ${pumpStatus === 0 ? "on" : "off"}`} onClick={() => {
                    
                  }} allowDisabledFocus /> 
                  : <span/>}
                             
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      </Stack>
    </div>
  );
}

export default App;
