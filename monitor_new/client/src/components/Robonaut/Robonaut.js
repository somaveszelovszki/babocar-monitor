import React from "react";
import {Container, Col, Row, Form, Table, Button } from "react-bootstrap"; // Necessary react-bootstrap components
import socketIOClient from "socket.io-client";
/* Page specific CSS file */
import './Robonaut.css';
const socket = socketIOClient("localhost:3001");
var jsonTree = []

function readJSON(jsonObject, level) {
  var keys = []
  for (let [key, value] of Object.entries(jsonObject)) {
    var jsonLeaf = []
    var jsonValue = {}
    if (typeof value === 'object' && value) {
      //console.log(`Has children: ${key}: ${value}`);
      keys.push(readJSON(value, level + 1))
    }
    else {
      console.log(`Level: ${level}: ${key}: ${value}`);
      var entry = {}
      entry[key] = value
      keys.push(entry)
    }
  }
  return keys
}

class InputField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentWillReceiveProps(props) {
		this.setState({ value: props.value })
  }
  
  handleKeyPress(event) {
    //console.log("handleKeyPress", event.key)
    if(event.key === 'Enter')
    {
      //console.log("Enter key pressed. Submit form to serial port.")
      this.props.handleEnter(event)
    }
  }

	// Input change handler function
	handleChange(event) {
    //console.log(event.target)
		this.setState({ value: event.target.value }) // Update input field state with new value
		console.log('Input', event.target.name, 'changed to', event.target.value)
		this.props.onInputChange({ key: event.target.name, value: event.target.value }) // Pass value to parent component
  }
  
  handleClick(event) {
    console.log('Clicked on child element: ' + event.target.name + ' ' +event.target.value );
    this.props.onClickParentHandler({ key: event.target.name, value: event.target.value }) // Pass value to parent component
  }

  render() {
    const name = this.props.name
    var input = null
    if (typeof(this.props.value) !== 'number' && typeof(this.props.value) !== 'string' && (this.props.value == true || this.props.value == false)) {
      if(this.props.value == true)
      {
        input = (<tr><td colSpan="2"><Form.Check
          custom
          checked
            type="checkbox"
            id={`default-checkbox`}
            label={this.props.name}
          /></td></tr>)
      }
      else
      {
        input = (<tr><td colSpan="2"><Form.Check
          custom
            type="checkbox"
            id={`default-checkbox`}
            label={this.props.name}
            /></td></tr>)
      }
    }
    else {
      input = <tr><td>{this.props.name}</td><td><input type="text" name={name} value={this.state.value} onChange={this.handleChange} onClick={this.handleClick} onKeyPress={this.handleKeyPress}></input></td></tr>
    }
    return input
  }
}

class SocketComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      response: null,
      serialData: null,
      endpoint: "localhost:3001"
    };
  }
  componentDidMount() {
  }
  render() {
    const { serialData } = this.state;
    serialData && console.log(Object.keys(JSON.parse(serialData)))
    return (
        <div style={{ textAlign: "center" }}>
          {serialData && serialData}
        </div>
    );
  }
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

/* Page specific name of the component */
export default class Robonaut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonFile: null,
      focusedItem: null,
      formData: {
        "useSafetyEnableSignal": true,
        "indicatorLedsEnabled": true,
        "startSignalEnabled": false,
        "lineFollowEnabled": true,
        "motorController_Ti": .3,
        "motorController_Kc": 1.0000,
        "frontLineController_P": 2.0000,
        "frontLineController_D": 0.0000,
        "rearLineController_P": 1.0000,
        "rearLineController_D": 1.0000,
        "car": {
          "pose": {
            "pos": {
              "X": 0.0000,
              "Y": 0.0000
            },
            "angle": 5.5793
          },
          "speed": -23.5300
        },
        "targetSpeedOverride": 0.0000,
        "targetSpeedOverrideActive": false
      }
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleEnter = this.handleEnter.bind(this)
  }
  onInputChange = (input) => {
		console.log('Parent component: onInputChange function', input)
    let dataCopy = JSON.parse(JSON.stringify(this.state.formData))
    console.log('this.state.formData', this.state.formData)
		if (input.hasOwnProperty('value') === true) {
				console.log('inputData changed to ' + [input.key] + ': ' + input.value)
				dataCopy[input.key] = input.value
		}
		else {
			dataCopy[input.key] = input.value
		}
		this.setState({ formData: dataCopy })
	}
  componentDidMount() {
    socket.on("dataFromSerial", data => this.setState({ serialData: JSON.parse(data) }));
    socket.on("dataFromJSON", data => this.setState({ response: data }));

    /*
    fetch('/form')
      .then(response => response.json())
      .then(data => this.setState({ jsonFile: data }, console.log(this.state.jsonFile)))
      .then(() => {
        //console.log('componentDidMount: ', this.state.jsonFile)
      });
      */
  }

  handleClick(e) {
    console.log("Parent handles child click: set focus to " + e.key)
    this.setState({focusedItem: e.key})
  }

  handleEnter(event) {
    //console.log("Parent Enter key handling", e)
    if(event.key === 'Enter')
    {
      console.log("Enter key pressed. Submit form to serial port.")
      this.handleSubmit()
    }
  }

  handleSubmit() {
    console.log('handleSubmit')
    var localData = this.state.formData
    for (let [key, value] of Object.entries(this.state.formData)) {
      //console.log({name: key, value: value}, typeof(value))
      if(typeof(value) === 'number')
      {
        console.log('Number: ', key + ' ' + value)
        localData[key] = parseFloat(value).toFixed(4)
      }
      else if(typeof(value) === 'string')
      {
        console.log('String: ', key + ' ' + value)
        if(parseFloat(value) !== NaN)
        {
          console.log('From: ', key + ' ' + value + ' (' + typeof(value) + ') to ' + key + ' ' + parseFloat(value).toFixed(4) + ' (' + typeof(parseFloat(value)) + ')')
          localData[key] = parseFloat(value).toFixed(4)
        }
      }
      if(isNaN(value) === false)
      {
        //console.log('handleSubmit: ' + key + ' ' + value)
        //console.log(parseFloat(value.toFixed(4)))
      }
    }
    console.log('localData', localData)
    socket.emit('dataFromClient', JSON.stringify(localData))
  }
  render() {
    var renderedElements = null
    const { serialData, focusedItem } = this.state
    //console.log(serialData)
    focusedItem && console.log("Current focused on rendering: " + focusedItem)
    if(this.state.serialData && focusedItem != 'motorController_Ti' && this.state.formData['motorController_Ti'] != this.state.serialData['motorController_Ti'])
    {
      console.log(this.state.formData['motorController_Ti'], this.state.serialData['motorController_Ti'])
      var localJson = this.state.formData
      localJson['motorController_Ti'] = this.state.serialData['motorController_Ti']
      this.setState({formData: localJson, serialData: null})
    }
    if(this.state.serialData && focusedItem != 'motorController_Kc' && this.state.formData['motorController_Kc'] != this.state.serialData['motorController_Kc'])
    {
      console.log(this.state.formData['motorController_Kc'], this.state.serialData['motorController_Kc'])
      var localJson = this.state.formData
      localJson['motorController_Kc'] = this.state.serialData['motorController_Kc']
      this.setState({formData: localJson, serialData: null})
    }
    if(this.state.serialData && focusedItem != 'frontLineController_P' && this.state.formData['frontLineController_P'] != this.state.serialData['frontLineController_P'])
    {
      console.log(this.state.formData['frontLineController_P'], this.state.serialData['frontLineController_P'])
      var localJson = this.state.formData
      localJson['frontLineController_P'] = this.state.serialData['frontLineController_P']
      this.setState({formData: localJson, serialData: null})
    }
    //console.log('formData', this.state.formData)
    if(this.state.formData) {
      var inputElements = []
      for (let [key, value] of Object.entries(this.state.formData)) {
        inputElements.push({name: key, value: value})
      }
      renderedElements = inputElements.map(element => {
        return <InputField name={element.name} value={element.value} onInputChange={this.onInputChange} onClickParentHandler={(e) => this.handleClick(e)} handleEnter={(e) => this.handleEnter(e)}></InputField>
      })
    }
    else {
      renderedElements = null
    }
    return (
      <div>
        <Container fluid>
          <Row>
            <Col>
            <SocketComponent />
            </Col>
          </Row>
          <Row>
            <Col>
            <Table striped bordered hover responsive style={{textAlign: 'center', width: '10%'}} size="sm">
              <thead>
                <tr>
                  <td colSpan="2">RobonAut form</td>
                </tr>
              </thead>
              <tbody>
                {renderedElements}
                <tr>
                <td colSpan="2"><Button variant="info" type="submit" onClick={this.handleSubmit}>Send to serial port</Button></td>
                </tr>
              </tbody>
            </Table>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
