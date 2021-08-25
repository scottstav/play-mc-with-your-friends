import React, { Component } from "react";
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

class Minecraft extends Component {

  constructor() {
    super();
    this.state = {
      isLoaded: false,
      ip: 'minecraft.scotty.dance'
    };
    this.fetchServerStatus = this.fetchServerStatus.bind(this);
    this.startServer = this.startServer.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
  }

  fetchServerStatus() {
    console.log("Updating status...")
    fetch(`${process.env.API_URL}/minecraft/state`)
      .then(res => res.json())
      .then(
        (result) => {
          console.log("Loaded server status...");
          let state = result.state;
          let message = "";
          if (state == "running" && !result.players) {
            state = "Starting server...";
          } else if (result.players && result.players.includes("There are 0")) {
            message = "No players... server will shutdown soon unless somebody connects.";
          }
          this.setState({
            isLoaded: true,
            players: result.players,
            state: state,
            message: message
          });
        },
        (error) => {
          this.setState({
            isLoaded: true
          });
          console.log(error);
        }
      )
  }

  startServer() {
    this.refs.startButton.setAttribute("disabled", "disabled");
    this.setState({
      isLoaded: false
    });
    console.log("Sending request to start server");
    fetch(`${process.env.API_URL}/minecraft/start`, { method: 'POST' })
      .then(res => res.json())
      .then(
        (result) => {
          console.log("Started server with Server Address: ${result.ip}");
          this.fetchServerStatus();
          this.setState({
            ip: result.ip
          });
        },
        (error) => {
          this.setState({
            isLoaded: true
          });
          console.log(error);
        }
      )
  }

  componentDidMount() {
    console.log(`Checking status from ${process.env.API_URL}`);
    this.fetchServerStatus();
  }

  refreshPage() {
    window.location.reload(false);
  }

  render() {
    let startServerButton = <div></div>;
    let playerList = <div></div>;
    let serverAddress = <div></div>;
    let status = '';
    let helpText = '';
    ;
    if (this.state.isLoaded) {
      if (this.state.players != 'unknown' && this.state.players != null) {
        playerList = <p>Players: <b style={{ color: "purple" }}>{this.state.players.split(":")[4]}</b></p>;
      }

      status = <p>Status: {this.state.state}</p>;
      if (this.state.state == 'stopped') {
        startServerButton = <Button style={{ textAlign: 'center' }} variant='success' ref='startButton' onClick={this.startServer}>Launch</Button>;
      } else if (this.state.state == 'pending') {
        helpText = <span> One moment... <a href='javascript:void(0)' onClick={this.refreshPage}> Refresh the Page</a></span>;
      } else if (this.state.state == 'running') {
        serverAddress = <p style={{ color: "green" }}><b>Server is ready, see you there!<br /></b> Server Address: {this.state.ip}</p>;
      }

      return (
        <div >
          <span style={{ textAlign: "center", backgroundColor: "black", color: "red" }}>1.16!</span>
          <br />
          <div style={{ display: "inline-block", textAlign: "left" }}>
            {serverAddress}
            {status}
            {helpText}
            {playerList}
            {this.state.message}

          </div>
          <div>
            {startServerButton}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Spinner animation="border" size="small" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      );
    }
  }
}

export default Minecraft;
