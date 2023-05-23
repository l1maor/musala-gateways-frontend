import React, { useEffect } from "react";
import axios from "axios";
import { AppBar, Tabs, Tab, Snackbar, Alert } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNetworkWired, faMicrochip } from "@fortawesome/free-solid-svg-icons";

import GatewaysTable from "./components/GatewaysTable";
import PeripheralsTable from "./components/PeripheralsTable";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6e7e91",
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#6e7e91",
            color: "#fff",
          },
        },
      },
    },
  },
});


function App() {
  const [value, setValue] = React.useState(0);
  const [gateways, setGateways] = React.useState([]);
  const [peripherals, setPeripherals] = React.useState([]);
  const [error, setError] = React.useState('')

  useEffect(() => {
    axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        console.log("🚀 ~ file: App.js:40 ~ error:", error);
        if (error.response?.data?.error && error.response?.data?.message) {
          console.error(
            `API CALL ERRROR`,
            error.response?.data?.message || "Server error"
          );
        }
        setError(error.response?.data?.message || "Server error")
        return Promise.reject(error);
      }
    );
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/gateway");
      const json = await response.json();
      console.log("🚀 ~ file: App.js:16 ~ fetchData ~ json:", json);
      setGateways(json);
    } catch (err) {
      console.error(err);
    }

    try {
      const response = await fetch("http://localhost:5000/api/peripheral");
      const json = await response.json();
      setPeripherals(json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError('')
  };

  return (
    <ThemeProvider theme={theme}>
      <Snackbar open={error} autoHideDuration={10000} onClose={handleCloseError}>
      <Alert onClose={handleCloseError} severity="error">
        {error}
      </Alert>
      </Snackbar>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab
            label="Gateways"
            icon={<FontAwesomeIcon icon={faNetworkWired} />}
          />
          <Tab
            label="Peripherals"
            icon={<FontAwesomeIcon icon={faMicrochip} />}
          />
        </Tabs>
      </AppBar>
      {value === 0 && (
        <GatewaysTable
          gateways={gateways}
          peripherals={peripherals}
          fetchData={fetchData}
        />
      )}
      {value === 1 && (
        <PeripheralsTable
          gateways={gateways}
          peripherals={peripherals}
          fetchData={fetchData}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
