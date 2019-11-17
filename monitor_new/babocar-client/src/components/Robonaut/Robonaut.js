import React from "react";
import { Card, CardDeck, Container, Col, Row, Form, Table, Button, InputGroup, FormControl } from "react-bootstrap"; // Necessary react-bootstrap components
import Menu from "../Menu/Menu" // Menu component
import Footer from "../Footer/Footer" // Footer component

import { person } from '@jsonforms/examples';
import { materialRenderers } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';

import socketIOClient from "socket.io-client";

import SocketCompontent from './SocketComponent'



/* Page specific CSS file */
import './Robonaut.css';

const serialCoreSchema = {
  type: 'object',
  properties: {
    useSafetyEnableSignal: { type: 'boolean' },
    indicatorLedsEnabled: { type: 'boolean' },
    startSignalEnabled: { type: 'boolean' },
    lineFollowEnabled: { type: 'boolean' },
    motorController_Ti: { type: 'number' },
    motorController_Kc: { type: 'number' },
    frontLineController_P: { type: 'number' },
    frontLineController_D: { type: 'number' },
    rearLineController_P: { type: 'number' },
    rearLineController_D: { type: 'number' }
  }
};

const schemaSerial = {
  type: 'object',
  properties: {
    ...serialCoreSchema.properties
  }
};

export const uischemaSerial = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Label',
      text: 'Boolean values'
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/useSafetyEnableSignal'
        },
        {
          type: 'Control',
          scope: '#/properties/indicatorLedsEnabled'
        },
        {
          type: 'Control',
          scope: '#/properties/startSignalEnabled'
        },
        {
          type: 'Control',
          scope: '#/properties/lineFollowEnabled'
        }
      ]
    },
    {
      type: 'Label',
      text: 'Number values'
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/lineFollowEnabled'
        }
      ]
    }
  ]
};

const dataSerial = {
  motorController_Ti: 484.0000,
  useSafetyEnableSignal: false
};

const schema = schemaSerial;
const uischema = uischemaSerial;
const data = dataSerial;

const socket = socketIOClient("localhost:3001");

var callback = console.log;
function traverse(obj) {
  var array = []
  if (obj instanceof Array) {
    for (var i = 0; i < obj.length; i++) {
      if (typeof obj[i] == "object" && obj[i]) {
        console.log('i', i)
        //callback(i);
        //array.push(traverse(obj[i]));
      } else {
        //callback(i, obj[i])
        console.log('i, obj[i]', i, obj[i])
        //array.push({name: i, value: obj[i]})
      }
    }
  } else {
    for (var prop in obj) {
      if (typeof obj[prop] == "object" && obj[prop]) {
        //callback(prop);
        console.log('prop', prop)
        array.push(traverse(obj[prop]));
      } else {
        //callback(prop, obj[prop]);
        console.log('prop, obj[prop]', prop, obj[prop])
        array.push({name: prop, value: obj[prop]})
      }
    }
  }
  return array;
}

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
    this.state = { value: this.props.defaultValue };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    var input = null
    if (this.props.defaultValue == true || this.props.defaultValue == false) {
      if(this.props.defaultValue == true)
      {
        input = (<tr><td colSpan="2"><Form.Check
          custom
          checked
            type="checkbox"
            id={`default-checkbox`}
            label={this.props.inputName}
          /></td></tr>)
      }
      else
      {
        input = (<tr><td colSpan="2"><Form.Check
          custom
            type="checkbox"
            id={`default-checkbox`}
            label={this.props.inputName}
            /></td></tr>)
      }
    }
    else {
      input = <tr><td>{this.props.inputName}</td><td><input type="text" value={this.state.value} onChange={this.handleChange} /></td></tr>
    }
    return input
  }
}

class SocketComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      response: null,
      endpoint: "localhost:3001"
    };
  }
  componentDidMount() {
    const { endpoint } = this.state;
    socket.on("dataFromJSON", data => this.setState({ response: data }));
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

/* Page specific name of the component */
export default class Robonaut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonFile: null,
      formData: {
        "useSafetyEnableSignal": true,
        "indicatorLedsEnabled": true,
        "startSignalEnabled": false,
        "lineFollowEnabled": true,
        "motorController_Ti": 484.0000,
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
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    fetch('/form')
      .then(response => response.json())
      .then(data => this.setState({ jsonFile: data }, console.log(this.state.jsonFile)))
      .then(() => {
        console.log('componentDidMount: ', this.state.jsonFile)
      });
  }
  handleSubmit() {
    console.log('handleSubmit')
    socket.emit('dataFromClient', '{\r\n  \"car\": {\r\n    \"pose\": {\r\n      \"pos\": {\r\n        \"X\": 100.0000,\r\n        \"Y\": 200.0000\r\n      },\r\n      \"angle\": 5.0000\r\n    },\r\n    \"speed\": 1.5000\r\n  },\r\n  \"useSafetySignal\": false,\r\n  \"motorEnabled\": true\r\n}')
  }
  render() {
    var check1 = null
    var check2 = null
    var text1 = null
    var text2 = null
    var renderedElements = null
    console.log('formData', this.state.formData)
    const { formData } = this.state.formData
    if(formData) {
      for (let [key, value] of Object.entries(formData)) {
        console.log(`${key}: ${value}`);
      }
      renderedElements = formData.map(element => {
        return <InputField inputName={element['name']} defaultValue={element['value']}></InputField>
      })
    }

    if (this.state.jsonFile !== null) {
      //const data = traverse(this.state.jsonFile)
      /*
      if(data) {
        renderedElements = data.map(element => {
          return <InputField inputName={element['name']} defaultValue={element['value']}></InputField>
        })
      }
      */
      /*
      var inputs = readJSON(this.state.jsonFile, 1)
      console.log(inputs)
      console.log("InputFiled rendering: ", Object.entries(inputs[1])[0][1])
      text1 = <InputField inputName={Object.entries(Object.entries(inputs[0])[1][1])[0][0]} defaultValue={Object.entries(Object.entries(inputs[0])[1][1])[0][1]}></InputField>
      text2 = <tr><td colSpan = "2"><InputGroup size="sm" className="mb-3">
      <InputGroup.Prepend>
        <InputGroup.Text id="basic-addon3">
        {Object.entries(Object.entries(inputs[0])[1][1])[0][0]}
        </InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl id="basic-url" aria-describedby="basic-addon3" value = {Object.entries(Object.entries(inputs[0])[1][1])[0][1]} />
    </InputGroup></td></tr>
      check1 = <InputField inputName={Object.entries(inputs[1])[0][0]} defaultValue={Object.entries(inputs[1])[0][1]}></InputField>
      check2 = <InputField inputName={Object.entries(inputs[2])[0][0]} defaultValue={Object.entries(inputs[2])[0][1]}></InputField>
    */
    }
    else {
      text1 = text2 = check1 = check2 = <p>Empty file</p>
      renderedElements = null
    }
    return (
      <div>
        <Container fluid>
          <Row>
            <Col>
            {renderedElements ? renderedElements : <b>No form</b>}
            <SocketComponent />
            <JsonForms
              schema={schema}
              uischema={uischema}
              data={data}
              renderers={materialRenderers}
            />
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
              {text1}
              {text2}
              {check1}
              {check2}
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
