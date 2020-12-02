import React from "react";
import { Col, Table, Button } from "react-bootstrap"; // Necessary react-bootstrap components
import InputField from './InputField'

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
      let dataCopy = JSON.parse(JSON.stringify(this.state.formData))
      if(input.key.includes('checkbox-') === true) {
        const key = input.key.split('checkbox-')[1]
        dataCopy[key] = input.value
          }
          else {
              dataCopy[input.key] = input.value
          }
          this.setState({ formData: dataCopy })
      }
    componentDidMount() {
      this.props.socket.on("dataFromSerial", data => {
        try {
          this.setState({ serialData: JSON.parse(data) });
        }
        catch(e) {
          console.log("dataFromSerial JSON parsing error");
        }
      });

      this.props.socket.on("dataFromJSON", data => this.setState({ response: data }));
    }
  
    handleClick(e) {
      this.setState({focusedItem: e.key})
    }
  
    handleEnter(event) {
      if(event.key === 'Enter') {
        this.handleSubmit()
      }
    }
  
    handleSubmit() {
      var localData = this.state.formData
      for (let [key, value] of Object.entries(this.state.formData)) {
        if(typeof(value) === 'number') {
          localData[key] = parseFloat(value).toFixed(4)
        }
        else if(typeof(value) === 'string') {
          if(isNaN(parseFloat(value)) === false) {
            localData[key] = parseFloat(value).toFixed(4)
          }
        }
      }
      console.log('localData', localData)
      this.props.socket.emit('dataFromClient', '[P]' + JSON.stringify(localData))
    }
    render() {
      var renderedElements = null
      const { focusedItem } = this.state
      var localJson = null
      focusedItem && console.log("Current focused on rendering: " + focusedItem)
      if(this.state.serialData && focusedItem !== 'frontLineController_P' && this.state.formData['frontLineController_P'] !== this.state.serialData['frontLineController_P'])
      {
        console.log(this.state.formData['frontLineController_P'], this.state.serialData['frontLineController_P'])
        localJson = this.state.formData
        localJson['frontLineController_P'] = this.state.serialData['frontLineController_P']
        this.setState({formData: localJson, serialData: null})
      }
      if(this.state.serialData && focusedItem !== 'frontLineController_D' && this.state.formData['frontLineController_D'] !== this.state.serialData['frontLineController_D'])
      {
        console.log(this.state.formData['frontLineController_D'], this.state.serialData['frontLineController_D'])
        localJson = this.state.formData
        localJson['frontLineController_D'] = this.state.serialData['frontLineController_D']
        this.setState({formData: localJson, serialData: null})
      }
      if(this.state.serialData && focusedItem !== 'rearLineController_P' && this.state.formData['rearLineController_P'] !== this.state.serialData['rearLineController_P'])
      {
        console.log(this.state.formData['rearLineController_P'], this.state.serialData['rearLineController_P'])
        localJson = this.state.formData
        localJson['rearLineController_P'] = this.state.serialData['rearLineController_P']
        this.setState({formData: localJson, serialData: null})
      }
      if(this.state.serialData && focusedItem !== 'rearLineController_D' && this.state.formData['rearLineController_D'] !== this.state.serialData['rearLineController_D'])
      {
        console.log(this.state.formData['rearLineController_D'], this.state.serialData['rearLineController_D'])
        localJson = this.state.formData
        localJson['rearLineController_D'] = this.state.serialData['rearLineController_D']
        this.setState({formData: localJson, serialData: null})
      }
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
  
