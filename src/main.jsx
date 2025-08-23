import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider, ColorModeScript, localStorageManager } from "@chakra-ui/react";
import { chakraTheme } from "./theme";
import { AuthProvider } from "react-oidc-context";
import { cognitoAuthConfig } from "./config/cognito.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={chakraTheme.config.initialColorMode} />
    <AuthProvider {...cognitoAuthConfig}>
      <ChakraProvider theme={chakraTheme} colorModeManager={localStorageManager}>
        <App />
      </ChakraProvider>
    </AuthProvider>
  </React.StrictMode>
);
