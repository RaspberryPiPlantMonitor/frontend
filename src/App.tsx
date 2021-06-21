import { useState, useEffect } from 'react';
import axios from "axios";
import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { DefaultPalette } from '@fluentui/react/lib/Styling';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { ProgressIndicator, IProgressIndicatorStyles  } from '@fluentui/react/lib/ProgressIndicator';
import { SpinButton, ISpinButtonStyles } from '@fluentui/react/lib/SpinButton';
import { Label } from '@fluentui/react/lib/Label';
import { Toggle } from '@fluentui/react/lib/Toggle';
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
    background: DefaultPalette.white,
    border: `1px solid ${DefaultPalette.blackTranslucent40}`,
  },
};

const stackItemStyles: IStackItemStyles = {
  root: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexFlow: 'column',
    marginBottom: "5px"
  },
};

const innerStackItemStyles: any = {
  root: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexFlow: 'column',
    borderBottom: `1px solid ${DefaultPalette.blackTranslucent40}`,
    paddingBottom: "3%",
    paddingTop: "3%"
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
  }
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

const toggleSyles: any = { 
  container : { 
    alignItems: "center",
    justifyContent: "center"
  }
}; 

const cameraImage = new Image() 

const TLS = process.env.REACT_APP_TLS === "true";
const HOST = window.location.host // "10.88.111.26:8080" //window.location.host //"1e59fe277944.ngrok.io" // "10.88.111.26:8080"

axios.defaults.baseURL = `${TLS ? "https" : "http"}://${HOST}`;
axios.defaults.withCredentials = true;

function App(props: any) {
  const password = props.password;
  axios.defaults.headers.common['Authorization'] = password

  const [humiditySensor, setHumiditySensor] = useState("");
  const [humiditySensorMin, setHumiditySensorMin] = useState("0");

  const [lightStatus, setLightStatus] = useState(0);
  const [pumpStatus, setPumpStatus] = useState(0);
  const [loadingLight, setLoadingLight] = useState(false);
  const [loadingPump, setLoadingPump] = useState(false);

  useEffect(() => {
    const websocket = new WebSocket(`${TLS ? "wss" : "ws"}://${HOST}/realtime?password=${password}`); 
    websocket.onopen = function () {
      console.log("Websocket connection established");
    };
  
    websocket.onclose = function () {
      console.log("Websocket disconnected");
      window.location.replace(`${window.location.pathname}?failed=true`);
    };

    websocket.onmessage = function (message: any) {
      // Check if socket is sending camera image
      if (message.data.startsWith("data:image")) {
        cameraImage.src = message.data;
      } else {
        try {
          const data = JSON.parse(message.data);
          setHumiditySensor(data.humidityValue);
          setLightStatus(data.lightValue);
          setPumpStatus(data.pumpValue);
        } catch(e) {}
      }
    };

    axios.get(`/humiditySensorMin`).then(response => {
      setHumiditySensorMin(response.data.value)
    })

  }, [password]);

  const drawCanvas = (canvas: any) => {
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
            <Canvas draw={drawCanvas} />
          </Stack.Item>
          <Stack.Item grow styles={stackItemStyles}>
            <Stack styles={innerStackStyles} tokens={customSpacingStackTokens}>
              <Stack.Item grow styles={innerStackItemStyles}>
                <Label>Humidity Sensor Reading: <h2>{humiditySensor}</h2></Label>
              </Stack.Item>
              <Stack.Item grow styles={innerStackItemStyles}>
                <SpinButton
                  label="Run pump when humidity lower than:"
                  value={humiditySensorMin}
                  onChange={(_, newValue) => { setHumiditySensorMin(newValue || "")}}
                  min={0}
                  step={1}
                  incrementButtonAriaLabel="Increase value by 1"
                  decrementButtonAriaLabel="Decrease value by 1"
                  styles={spinButtonStyles}
                />
                <br/>
                <DefaultButton text="Save" onClick={async () => {
                  await axios.post(`/humiditySensorMin`, {
                    Value: Number(humiditySensorMin)
                  });
                  alert("Saved!")
                }}/>
              </Stack.Item>
              <Stack.Item grow styles={innerStackItemStyles}>
                {loadingLight ?
                  <>
                    <Label>Updating Light Switch</Label>
                    <Spinner size={SpinnerSize.large} />
                  </> :
                  <Toggle label="Light Switch" checked={lightStatus === 1} styles={toggleSyles} onText="On" offText="Off" onChange={async () => {
                    setLoadingLight(true)
                    try {
                      await axios.post(`/lightRelay`, { Value: lightStatus === 0 ? "on" : "off"})
                    } catch(e) {
                      console.log(e)
                    }
                    setLoadingLight(false)
                  }} /> 
                }
              </Stack.Item>
              <Stack.Item grow styles={{root: {...innerStackItemStyles.root, borderBottom: 0}}}>
                {loadingPump ?
                    <>
                      <Label>Updating Water Pump Switch</Label>
                      <Spinner size={SpinnerSize.large} />
                    </> :
                  <Toggle label="Water Pump Switch" checked={pumpStatus === 1} styles={toggleSyles} onText="On" offText="Off" onChange={async () => {
                    setLoadingPump(true)
                    try {
                      await axios.post(`/pumpRelay`, { Value: pumpStatus === 0 ? "on" : "off"})
                    } catch(e) {
                      console.log(e)
                    }
                    setLoadingPump(false)
                  }} /> 
                }
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      </Stack>
    </div>
  );
}

export default App;
