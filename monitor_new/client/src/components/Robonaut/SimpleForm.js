import React from "react";
import { Container, Col, Row, Form, Table, Button } from "react-bootstrap"; // Necessary react-bootstrap components
import InputField from './InputField'
import SimpleForm from './SimpleForm'
import './Robonaut.css';

export default class SimpleFrom extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        focusedItem: null,
        formData: {
          "frontLineCtrl_P_slow": 2.0000,
          "frontLineCtrl_D_slow": 0.0000,
          "rearLineCtrl_P_slow": 1.0000,
          "rearLineCtrl_D_slow": 1.0000
        }
      }
      this.handleSubmit = this.handleSubmit.bind(this)
      this.onInputChange = this.onInputChange.bind(this)
      this.handleClick = this.handleClick.bind(this)
      this.handleEnter = this.handleEnter.bind(this)
    }
  
    onInputChange = (input) => {
          //console.log('Parent component: onInputChange function', input)
      let dataCopy = JSON.parse(JSON.stringify(this.state.formData))
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
      this.props.socket.on("dataFromSerial", data => this.setState({ serialData: JSON.parse(data) }));
      this.props.socket.on("dataFromJSON", data => this.setState({ response: data }));
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
      this.props.socket.emit('dataFromClient', '[P]' + JSON.stringify(localData))
    }
    render() {
      var renderedElements = null
      const { focusedItem } = this.state
      focusedItem && console.log("Current focused on rendering: " + focusedItem)
      if(this.state.serialData && focusedItem !== 'frontLineController_P' && this.state.formData['frontLineController_P'] != this.state.serialData['frontLineController_P'])
      {
        console.log(this.state.formData['frontLineController_P'], this.state.serialData['frontLineController_P'])
        var localJson = this.state.formData
        localJson['frontLineController_P'] = this.state.serialData['frontLineController_P']
        this.setState({formData: localJson, serialData: null})
      }
      if(this.state.serialData && focusedItem !== 'frontLineController_D' && this.state.formData['frontLineController_D'] !== this.state.serialData['frontLineController_D'])
      {
        console.log(this.state.formData['frontLineController_D'], this.state.serialData['frontLineController_D'])
        var localJson = this.state.formData
        localJson['frontLineController_D'] = this.state.serialData['frontLineController_D']
        this.setState({formData: localJson, serialData: null})
      }
      if(this.state.serialData && focusedItem !== 'rearLineController_P' && this.state.formData['rearLineController_P'] !== this.state.serialData['rearLineController_P'])
      {
        console.log(this.state.formData['rearLineController_P'], this.state.serialData['rearLineController_P'])
        var localJson = this.state.formData
        localJson['rearLineController_P'] = this.state.serialData['rearLineController_P']
        this.setState({formData: localJson, serialData: null})
      }
      if(this.state.serialData && focusedItem !== 'rearLineController_D' && this.state.formData['rearLineController_D'] !== this.state.serialData['rearLineController_D'])
      {
        console.log(this.state.formData['rearLineController_D'], this.state.serialData['rearLineController_D'])
        var localJson = this.state.formData
        localJson['rearLineController_D'] = this.state.serialData['rearLineController_D']
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
            <Col>
            <Table striped bordered hover responsive style={{textAlign: 'center', width: '10%'}} size="sm">
            <thead>
                <tr>
                <td colSpan="2">RobonAut <b>simplified</b> form</td>
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
      )
    }
  }
  