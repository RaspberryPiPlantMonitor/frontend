import React, { useState } from 'react';
import { Stack, IStackTokens, IStackStyles } from '@fluentui/react/lib/Stack';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import plantImage from './assets/plant.png'

// Example formatting
const stackTokens: IStackTokens = { childrenGap: 40 };
const stackStyles: Partial<IStackStyles> = { 
    root: { 
        margin: "auto",
        width: "50%",
        border: "2px solid rgb(0, 120, 212)",
        padding: "10px",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    } 
}; 

const plantImageStyle: any = {
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, -100%)"
}

function Login(props: any) {
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    if (loggedIn) {
        const childrenWithProps = React.Children.map(props.children, child => {
            // checking isValidElement is the safe way and avoids a typescript error too
            if (React.isValidElement(child)) {
              return React.cloneElement<any>(child, { password });
            }
            return child;
          });
        return childrenWithProps
    }

    const handleKeypress = (e: any) => {
        if (e.charCode === 13 || e.key === "Enter" || e.code === "Enter") {
            setLoggedIn(true)
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const failedParam = urlParams.get('failed');

    return (
        <div className="Login">
            {failedParam === "true" ?
            <MessageBar
                messageBarType={MessageBarType.error}
                isMultiline={false}
                dismissButtonAriaLabel="Close"
            >
                Incorrect magic word, try again :(
            </MessageBar>
            : <span/>}
            <Stack tokens={stackTokens} styles={stackStyles}>
                <span style={plantImageStyle}>
                    <img src={plantImage} style={{width: "150px"}} alt="Plant Monitor" />
                </span>
                <TextField
                    label="Tell me the magic word ;)"
                    type="password"
                    value={password}
                    onChange={(_, newValue) => {
                        const newPassword = newValue || ""
                        setPassword(newPassword)
                    }}
                    onKeyPress={handleKeypress}
                    canRevealPassword
                    revealPasswordAriaLabel="Show password"
                />
                <PrimaryButton text="Login" onClick={() => {
                    setLoggedIn(true)
                }} allowDisabledFocus />
            </Stack>
        </div>
    );
}

export default Login;
