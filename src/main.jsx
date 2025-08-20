import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Authenticator, ThemeProvider } from "@aws-amplify/ui-react";
import { ChakraProvider, ColorModeScript, localStorageManager } from "@chakra-ui/react";
import { chakraTheme, amplifyTheme } from "./theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={chakraTheme.config.initialColorMode} />
    <ChakraProvider theme={chakraTheme} colorModeManager={localStorageManager}>
      <ThemeProvider theme={amplifyTheme}>
        <Authenticator>
          <App />
        </Authenticator>
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>
);
