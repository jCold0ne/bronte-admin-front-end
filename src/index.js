import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { Provider } from "react-redux";
import store from "./store";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import "typeface-roboto";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "./components/styles/global.css";
import "font-awesome/css/font-awesome.min.css";

//Changing Material-UI's preset colour themes
const theme = createMuiTheme({
  palette: {
    primary: {
      // Pink
      main: "#FFDBDD"
    },
    secondary: {
      // Dark Pink
      main: "#D3A6A9"
    }
  }
});

//Wrapping App with Redux and a customized Theme
ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);
