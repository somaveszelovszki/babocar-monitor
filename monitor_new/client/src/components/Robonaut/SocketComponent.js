import React, { Component } from "react";

class SocketComponent extends Component {

  constructor() {
    super();
    this.state = {
      response: null
    };
  }
  componentDidMount() {
  }
  render() {
    console.log(this.props.data)
    const { content } = this.props.data;
    return (
        <div style={{ textAlign: "center" }}>
          {content}
        </div>
    );
  }
}
export default SocketComponent;