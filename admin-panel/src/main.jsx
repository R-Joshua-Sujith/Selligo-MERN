import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { dataStore, persistor } from "./store/index.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={dataStore}>
    <PersistGate Loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
