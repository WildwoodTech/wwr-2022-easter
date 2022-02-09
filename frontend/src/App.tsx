import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SnowStorm from "react-snowstorm";

import Home from "./containers/Home";
import Stats from "./containers/Stats";
import Admin from "./containers/Admin";

import "./styles/main.scss";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              {/* <SnowStorm
                excludeMobile={false}
                flakesMaxActive={55}
                followMouse={false}
                freezeOnBlur={false}
                snowStick={false}
                vMaxX={1}
                vMaxY={1.3}
              /> */}
            </>
          }
        />
        {/* <Route path="/stats" element={<Stats />} /> */}
        {/* <Route path="/admin" element={<Admin />} /> */}
        <Route path="/*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
