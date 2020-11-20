import React from "react";
import { Navbar } from "react-bootstrap"; // Necessary react-bootstrap components
import logo from '../resources/img/logo.png'
import StatusBar from './StatusBar'

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {

    const headerVariant = this.props.controllerButtonMode === true ? 'buttonInEnableMode' : 'buttonInGasMode';

    return (
        <Navbar bg={headerVariant} variant="light" style = {{textAlign: 'center', marginBottom: '5px'}}>
        <Navbar.Brand href="#home">
          <img
            alt=""
            src={logo}
            width="75"
            height="75"
            className="d-inline-block align-top"
          />{' '}
        </Navbar.Brand>
        <div style = {{color: 'black'}}>
          Unemployed &amp; Single
        </div>
        <div style = {{ margin: 10, position: 'absolute', right: 10 }}>
          <StatusBar
            posX = {this.props.posX}
            posY = {this.props.posY}
            angle = {this.props.angle}
            speed = {this.props.speed}
          />
        </div>
      </Navbar>
    )
  }
}
