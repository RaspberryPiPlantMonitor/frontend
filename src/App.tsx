import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { DefaultPalette } from '@fluentui/react/lib/Styling';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { SpinButton, ISpinButtonStyles } from '@fluentui/react/lib/SpinButton';
import Canvas from './Canvas';
import plantImage from './assets/plant2.png'
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
    height: 250,
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
    border: "1px",
    borderStyle: "solid"
  },
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

function App(props: any) {
  const camera_img = props.camera_img;

  const draw = (canvas: any) => {
    const context = canvas.getContext("2d");
    context.font = "20px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";

    camera_img.onload = function () {
      canvas.width = camera_img.width
      canvas.height = camera_img.height
      context.drawImage(camera_img, 0, 0, camera_img.width, camera_img.height);
    };

    camera_img.onerror = function () {
      context.fillText("Video failed to load!", canvas.width/2, canvas.height/2);
    }
    if (camera_img.src === "") {
      context.fillText("Loading video...", canvas.width/2, canvas.height/2);
    }
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
            <Stack horizontal styles={stackStyles} tokens={customSpacingStackTokens}>
              <Stack.Item grow styles={innerStackItemStyles}>
                <h3>Humidity Sensor Value: </h3>
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
