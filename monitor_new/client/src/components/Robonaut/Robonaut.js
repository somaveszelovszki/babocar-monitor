import React from "react";
import { Navbar, Container, Col, Row, Form, Table, Button, Tabs, Tab } from "react-bootstrap"; // Necessary react-bootstrap components
import socketIOClient from "socket.io-client";
import InputField from './InputField'
import SimpleForm from './SimpleForm'
import { generateTable } from './Recursive'
import LogViewer from './LogViewer'
import './Robonaut.css';
import logo from '../../resources/img/logo.png'
import mapIcon from '../../resources/img/map.png'
import {
  JsonTree,
} from 'react-editable-json-tree'

const socket = socketIOClient("192.168.137.66:3001");

const TabStyle = {
  border: '1px solid rgba(0, 0, 0, .125)',
  borderBottomRightRadius: '.25rem',
  borderBottomLeftRadius: '.25rem',
  padding: '15px',
  marginBottom: '5px'
}

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
    //this.generateTable = this.generateTable.bind(this)
  }

  findKeyInJson(input)
  {
    console.log('findKeyInJson', input);
    
  }

  onInputChange = (input) => {
		console.log('Parent component: onInputChange function', input)
    let dataCopy = JSON.parse(JSON.stringify(this.state.formData))
    if(dataCopy.hasOwnProperty(input.key) === false)
    {
      this.findKeyInJson(input)
    }
    if(input.key.includes('checkbox-') === true) {
      const key = input.key.split('checkbox-')[1]
      //console.log('Parent boolean change: ' + key + ' to ' + input.value)
      dataCopy[key] = input.value
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
    //console.log("Parent handles child click: set focus to " + e.key)
    this.setState({focusedItem: e.key})
  }

  handleEnter(event) {
    //console.log("Parent Enter key handling", e)
    if(event.key === 'Enter')
    {
      //console.log("Enter key pressed. Submit form to serial port.")
      this.handleSubmit()
    }
  }

  handleSubmit() {
    //console.log('handleSubmit')
    var localData = this.state.formData
    for (let [key, value] of Object.entries(this.state.formData)) {
      //console.log({name: key, value: value}, typeof(value))
      if(typeof(value) === 'number')
      {
        //console.log('Number: ', key + ' ' + value)
        localData[key] = parseFloat(value).toFixed(4)
      }
      else if(typeof(value) === 'string')
      {
        //console.log('String: ', key + ' ' + value)
        if(isNaN(parseFloat(value)) === false)
        {
          //console.log('From: ', key + ' ' + value + ' (' + typeof(value) + ') to ' + key + ' ' + parseFloat(value).toFixed(4) + ' (' + typeof(parseFloat(value)) + ')')
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
    var recursiveTable = generateTable(this.state.formData, this.onInputChange, this.handleEnter, this.handleClick)
    var renderedElements = null
    const { focusedItem } = this.state
    focusedItem && console.log("Current focused on rendering: " + focusedItem)
    this.state.serialData && console.log('hey',  focusedItem, this.state.formData['motorController_Ti'], this.state.serialData['motorController_Ti'])
    if(this.state.serialData && focusedItem !== 'motorController_Ti' && this.state.formData['motorController_Ti'] != this.state.serialData['motorController_Ti'])
    {
      console.log(this.state.formData['motorController_Ti'], this.state.serialData['motorController_Ti'])
      var localJson = this.state.formData
      localJson['motorController_Ti'] = this.state.serialData['motorController_Ti']
      this.setState({formData: localJson, serialData: null})
    }
    if(this.state.serialData && focusedItem !== 'motorController_Kc' && this.state.formData['motorController_Kc'] !== this.state.serialData['motorController_Kc'])
    {
      console.log(this.state.formData['motorController_Kc'], this.state.serialData['motorController_Kc'])
      var localJson = this.state.formData
      localJson['motorController_Kc'] = this.state.serialData['motorController_Kc']
      this.setState({formData: localJson, serialData: null})
    }
    if(this.state.serialData && focusedItem !== 'frontLineController_P' && this.state.formData['frontLineController_P'] !== this.state.serialData['frontLineController_P'])
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
        return <InputField key = {'input-'+element.name} name={element.name} value={element.value} onInputChange={this.onInputChange} onClickParentHandler={(e) => this.handleClick(e)} handleEnter={(e) => this.handleEnter(e)}></InputField>
      })
    }
    else {
      renderedElements = null
    }
    return (
      <div>
        <Container fluid>
        <Navbar bg="light" variant="light" style = {{textAlign: 'center', marginBottom: '5px'}}>
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
      </Navbar>
        <Row>
            <Col sm={4}>
            <Tabs defaultActiveKey="simpleform" id="uncontrolled-tab-example">
              <Tab eventKey="simpleform" title="Simple form" style = {TabStyle}>
                <SimpleForm socket = {socket} />
              </Tab>
              <Tab eventKey="map" title="Map" style = {TabStyle}>
              <img src = {mapIcon} /> The Map feature will be avaliable here.
              </Tab>
              <Tab eventKey="tree" title="Tree" style = {TabStyle}>
              <JsonTree data={this.state.formData} />
              </Tab>
            </Tabs>          
            </Col>
            <Col sm={8}>
              <LogViewer socket = {socket} />
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
          <Row>
            <Col>
            {recursiveTable && recursiveTable}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
