import React from "react";
import { Col, Table, Button } from "react-bootstrap"; // Necessary react-bootstrap components
import InputField from './InputField'

export default class RefactoredForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        focusedItem: null,
        formData: {},
        serialData: null,
        customFieldName: '',
        customFieldValue: '',
        checkedFields: [
          'posXm',
          'frontWheelAngleDeg'
        ]
      }
      this.handleSubmit = this.handleSubmit.bind(this)
      this.onInputChange = this.onInputChange.bind(this)
      this.handleClick = this.handleClick.bind(this)
      this.handleEnter = this.handleEnter.bind(this)
      this.updateFormData = this.updateFormData.bind(this)
      this.handleCustomFieldChange = this.handleCustomFieldChange.bind(this)
      this.onGraphCheckboxChange = this.onGraphCheckboxChange.bind(this)
      this.addFormDataToChart = this.addFormDataToChart.bind(this)
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

    updateFormData = (serialData) => {
      //console.log('updateFormData', serialData);
      const formDataToUpdate = {...this.state.formData}
      let dataForUpdate = {...this.state.serialData}
      const focusedKey = this.state.focusedItem
      if(focusedKey) {
        //console.log('Do not update focused key:', dataForUpdate[focusedKey], formDataToUpdate[focusedKey]);
        dataForUpdate[focusedKey] = formDataToUpdate[focusedKey]
      }
      //console.log('dataForUpdate', dataForUpdate);
      if(dataForUpdate.hasOwnProperty('isRemoteControlled')) {
        this.props.forwardisRemoteControlled(dataForUpdate.isRemoteControlled)
      }
      this.setState({ formData: dataForUpdate })
    }

    componentDidMount() {
      this.props.socket.on("dataFromSerial", data => {
        try {
          const parsedData = typeof(data) === 'object' ? data : JSON.parse(data)
          //console.log('RefactoredForm on dataFromSerial', typeof(parsedData), parsedData);
          this.setState({ serialData: parsedData}, this.updateFormData(parsedData));
        }
        catch(e) {
          console.error("dataFromSerial JSON parsing error", e);
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
      const { customFieldName, customFieldValue } = this.state
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
      // Add custom field to serial data if it is not empty
      if(customFieldName !== '' && customFieldValue !== '') {
        localData[customFieldName] = customFieldValue
      }
      //console.log('localData', localData)
      this.props.socket.emit('dataFromClient', '[P]' + JSON.stringify(localData) + '$')
    }

    
    // This function updates the custom field in the state management
    handleCustomFieldChange(event) {
      const target = event.target;
      const { value, name } = target;
      //const name = target.name;
      console.log('handleCustomFieldChange', event, target, name, value);

      this.setState({
        [name]: value
      });
    }

    render() {
      var renderedElements
      const { focusedItem } = this.state
      focusedItem && console.log("Current focused on rendering: " + focusedItem)
      if(this.state.formData) {
        var inputElements = []
        for (let [key, value] of Object.entries(this.state.formData)) {
          inputElements.push({name: key, value: value})
        }
        renderedElements = inputElements.map(element => {
          //console.log('Element', this.state.checkedFields.includes(element.name), element);
          return (
            <InputField
              key = {'input-'+element.name}
              name={element.name}
              value={element.value}
              onInputChange={this.onInputChange}
              onClickParentHandler={(e) => this.handleClick(e)}
              handleEnter={(e) => this.handleEnter(e)}
            />
          )
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
                      <td colSpan="2">RobonAut <b>refactored</b> form</td>
                    </tr>
                </thead>
                <tbody>
                    {renderedElements}
                    <tr>
                      <td>
                        <input
                          type="text"
                          id="customFieldName"
                          name="customFieldName"
                          value = {this.state.customFieldName}
                          onChange = {this.handleCustomFieldChange}
                          onKeyPress={(e) => this.handleEnter(e)}
                          placeholder = "Custom field name"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          id="customFieldValue"
                          name="customFieldValue"
                          value = {this.state.customFieldValue}
                          onChange = {this.handleCustomFieldChange}
                          onKeyPress={(e) => this.handleEnter(e)}
                          placeholder = "Custom field value"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2">
                        <Button
                          variant="info"
                          type="submit"
                          onClick={this.handleSubmit}
                        >
                          Send to serial port
                        </Button>
                      </td>
                    </tr>
                </tbody>
              </Table>
            </Col>
      )
    }
  }
  
