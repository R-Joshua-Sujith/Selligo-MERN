import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { dataStore, persistor } from "./store/index.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={dataStore}>
    <PersistGate Loading={null} persistor={persistor}>
      <App className="main-app-container" />
    </PersistGate>
  </Provider>
);
