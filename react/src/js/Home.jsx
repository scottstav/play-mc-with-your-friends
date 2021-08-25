import React, { Component } from "react";
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Minecraft from "./Minecraft.jsx";
import '../styles/modes.css';

class Home extends Component {

  render() {
    return (
      <div>
        <Router>
          <div className={"main-content"}>
            <Switch>
              <Route path="/minecraft"><Minecraft /></Route>
              <Route exact path="/">
                <Redirect to="/minecraft" />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default Home;
