import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId="260859807292-pnm5uphis18kb49fuc2cbu9jhrit17pp.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);