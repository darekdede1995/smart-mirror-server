import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import StartPage from "./components/startPage.component";
import ConfigPage from "./components/configPage.component";
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/config" component={ConfigPage} />
          <Route path="/" component={StartPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
