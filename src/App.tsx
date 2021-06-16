import React, { useState, useEffect } from 'react';
import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { DefaultPalette } from '@fluentui/react/lib/Styling';
import { DefaultButton } from '@fluentui/react/lib/Button';
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

const cameraImage = new Image() 

function App(props: any) {
  const websocket = props.websocket;
  const [humiditySensor, setHumiditySensor] = useState("");

  useEffect(() => {
    websocket.onmessage = function (message: any) {
      // Check if socket is sending camera image
      if (message.data.startsWith("data:image")) cameraImage.src = message.data;
      else setHumiditySensor(message.data);
    };
  }, [websocket]);

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
    return <span></span>
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
                <h3>Humidity Sensor Value: <h2>{humiditySensor}</h2></h3>
                <SpinButton
                  label="Run pump when humidity equals to:"
                  defaultValue="0"
                  min={0}
                  step={1}
                  incrementButtonAriaLabel="Increase value by 1"
                  decrementButtonAriaLabel="Decrease value by 1"
                  styles={spinButtonStyles}
                />
                <br/>
                <DefaultButton text="Save" />
              </Stack.Item>
              <Stack.Item grow styles={innerStackItemStyles}>
                <h3>Light (Relay Sensor) Status:  </h3>
                <DefaultButton text="Turn light off/on" onClick={() => {}} allowDisabledFocus />  
              </Stack.Item>
              <Stack.Item grow styles={innerStackItemStyles}>
                <h3>Water pump status: asdasdasd</h3>
                <DefaultButton text="Activate pump" onClick={() => {}} allowDisabledFocus />                
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      </Stack>
    </div>
  );
}

export default App;
