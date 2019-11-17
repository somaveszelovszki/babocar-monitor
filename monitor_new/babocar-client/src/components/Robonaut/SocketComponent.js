import React, { Component } from "react";
import socketIOClient from "socket.io-client";
class SocketComponent extends Component {
  constructor() {
    super();
    this.state = {
      response: null,
      endpoint: "localhost:3001"
    };
  }
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("dataFromSerial", data => this.setState({ response: data }));
  }
  render() {
    console.log(this.state.response)
    const { response } = this.state;
    return (
        <div style={{ textAlign: "center" }}>

        </div>
    );
  }
}
export default SocketComponent;