import React from "react";
import { Navbar, Container, Col, Row, Table, Button, Tabs, Tab } from "react-bootstrap"; // Necessary react-bootstrap components
import socketIOClient from "socket.io-client";
import InputField from './InputField'
import SimpleForm from './SimpleForm'
import Map from './Map'
import { getSimpleObjects } from './Recursive'
import LogViewer from './LogViewer'
import './Robonaut.css';
import logo from '../../resources/img/logo.png'
import mapIcon from '../../resources/img/map.png'
import {
  JsonTree,
} from 'react-editable-json-tree'

const socket = socketIOClient("10.42.0.39:3001");

var counter = 1

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
        "targetSpeedOverride": 0.0000,
        "targetSpeedOverrideActive": false
      },
      mapCoordinates: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleEnter = this.handleEnter.bind(this)
    this.findKeyInJson = this.findKeyInJson.bind(this)
    this.updateValue = this.updateValue.bind(this)
    this.searchKey = this.searchKey.bind(this)
    this.editJSON = this.editJSON.bind(this)
    this.updateFormData = this.updateFormData.bind(this)
    //this.generateTable = this.generateTable.bind(this)
  }

  updateValue()
  {
    console.log('updateValue set speed to ', counter);
    
    var data = this.state.formData
    data['car']['speed'] = counter
    data['car']['pose']['angle'] = counter+1
    data['car']['pose']['pos']['X'] = counter+2
    counter += 1
    this.setState({formData: data})
  }

  findKeyInJson(input)
  {
    var inputData = this.state.formData
    //console.log('findKeyInJson', input);
    if(inputData.hasOwnProperty(input.key))
    {
      //console.log('Top level child');
    }
    else {
      for (let [key, value] of Object.entries(inputData)) {
        if(typeof(value) === 'object')
        {
          //console.log('An object:', value)
          //console.log('Attr of obj: key = ', key, " value = ", value, " inputData[key][input.key] = ", inputData[key][input.key]);
          if(isNaN(parseFloat(input.value)) === true)
          {
            //console.log('From: ', [input.key] + ' ' + value[input.key] + ' (' + typeof(value) + ') to ' + key + ' ' + parseFloat(value).toFixed(4) + ' (' + typeof(parseFloat(value)) + ')')
            inputData[key][input.key] = parseFloat(input.value).toFixed(4)
          }
          //inputData[key][input.key] = input.value
          //console.log('From: ', key + ' ' + value + ' (' + typeof(value) + ') to ' + input.key + ' ' + parseFloat(input.value).toFixed(4) + ' (' + typeof(parseFloat(input.value)) + ')')
          inputData[key][input.key] = parseFloat(input.value).toFixed(4)
          //console.log('Attr of MODIFIED obj: key = ', key, " value = ", value, " inputData[key][input.key] = ", inputData[key][input.key]);
          /*
          if(value.hasOwnProperty(input.key))
          {
            console.log('Top level child:', key, value, inputData[key][input.key], input.value);
            //formData[value][input.key] = input.value
            //this.setState({formData: formData})
          }
          else {
            for (let [key, value] of Object.entries(value)) {
              if(typeof(value) === 'object')
              {
                console.log('object found:', value)
                console.log('Object2:', key, value, inputData[key][input.key], input.value);
              }
            }
          }
                  */
        }
      }
    }
    //console.log('Setting state to ', inputData);
    this.setState({ formData: inputData })
  }

  searchKey(haystack, needle, deep)
  {
    var retObject = {
      found: false,
      deepness: deep
    }
    if(haystack.hasOwnProperty(needle.key) === true)
    {
      retObject['found'] = true 
      console.log('Top level parameter found:', needle, retObject['found'])
      retObject['deepness'] !== '' ? retObject['deepness'] += ('-' + needle.key) : retObject['deepness'] += needle.key
    }
    else {
      for (let [key, value] of Object.entries(haystack)) {
        if(typeof value === 'object')
        {
          retObject['deepness'] !== '' ? retObject['deepness'] += ('-' + key) : retObject['deepness'] += key
          retObject = this.searchKey(value, needle, retObject['deepness'])
        }
      }
    }
    return retObject
  }

  onInputChange = (input) => {
    console.log('onInputChange:', input)    
    var parsedJSON = this.editJSON(this.state.formData, input.key, input.value)
    try {
      console.log('parsedJSON', parsedJSON);
      this.setState({formData: parsedJSON})
    }
    catch(e)
    {
      if(e instanceof SyntaxError)
      {
        console.error(e.message);
      }
      else {
        console.error(e)
      }
    }
    /*
    var deepness = this.searchKey(this.state.formData, input, '')
    console.log('onInputChange deepness', deepness)
    var depths = deepness.deepness.split('-')
    var deepPart = data
    for(var i = 0; i < depths.length-1; i++)
    {
      console.log('deeper', depths[i])
      console.log('deepPart[depths[i]]', deepPart[depths[i]])
      deepPart = deepPart[depths[i]]
    }
    console.log('deepPart', deepPart)
    // wtf?!
    console.log('---------------------------------------------------')
    var originalMsg = JSON.stringify(data);
    var regexp = `"${input.key}":[+-]?[0-9]+.?[0-9]?` // '"' + input.key +'":[+-]?[0-9]+.?[0-9]?'
    //console.log('data', data)
    //console.log('originalMsg', originalMsg)
    //console.log('Looking for:', input.key, 'with', regexp)
    var updatedMsg = originalMsg.replace(regexp, '"' + input.key + '":"' + input.value);
    //console.log('updatedMsg', updatedMsg)
    //console.log('newObj', newObj);

    //const regex = RegExp('"' + input.key +'":[\+\-]?[0-9]+\.?[0-9]*');
    const regex = RegExp(/false/);
    console.log('Original message: ', originalMsg)
    console.log('Pattern: ', regex.source)
    console.log('regexp tester', regex.test(originalMsg));
    updatedMsg = originalMsg.replace(regex, '"' + input.key +'":' + input.value)

    console.log('originalMsg.search(regex)', originalMsg.search(regex));

    console.log('updatedMsg', updatedMsg);
    */

    /*
    if(data['car'].hasOwnProperty(input.key))
    {
      data['car'][input.key] = input.value
    }
    if(data['car']['pose']['pos'].hasOwnProperty(input.key))
    {
      data['car']['pose']['pos'][input.key] = input.value
    }
    data['car']['pose']['angle'] = counter+1
    //data['car']['pose']['pos']['X'] = counter+2
    counter += 1
    */
    //this.setState({formData: JSON.parse(updatedMsg)})
    /*
    let dataCopy = JSON.parse(JSON.stringify(this.state.formData))
    if(dataCopy.hasOwnProperty(input.key) === false)
    {
      console.log("Not top level parameter:", input.key, input.value);
      //this.findKeyInJson(input)
    }
    else if(input.key.includes('checkbox-') === true) {
      const key = input.key.split('checkbox-')[1]
      //console.log('Parent boolean change: ' + key + ' to ' + input.value)
      dataCopy[key] = input.value
		}
		else {
			dataCopy[input.key] = input.value
		}
    this.setState({ formData: dataCopy })
    */
  }
  
  updateFormData(serialData)
  {
    const { focusedItem } = this.state
    console.log(`updateFormData: `, focusedItem);
    if(typeof(serialData) !== 'object')
    {
      // error handling?
    }
    if(serialData && this.state.focusedItem)
    {
      var originalMsg = JSON.stringify(serialData);
      const lockedItem = this.state.focusedItem
      const modifedKeyValuePair = '"' + lockedItem.key + '":' + lockedItem.value.toString()
      const pattern = '"' + lockedItem.key + '":[+-]?[0-9]+[.]?[0-9]?'
      let re = new RegExp(pattern)
      console.log('serialData', originalMsg)
      console.log(`pattern: ${pattern} and modifedKeyValuePair: ${modifedKeyValuePair}`);
      console.log(`Testing regexp for string: ${re.test(originalMsg)}`);
      var updatedMsg = originalMsg.replace(re, modifedKeyValuePair);
      console.log('updatedMsg', updatedMsg)
      var newObj = JSON.parse(updatedMsg); 
      console.log('newObj', newObj);
      return { serialData: JSON.parse(originalMsg), formData: newObj }
      //this.setState({ serialData: JSON.parse(originalMsg), formData: JSON.parse(newObj) })
    }
  }

  componentDidMount() {
    socket.on("dataFromSerial", data => {
      console.log('dataFromSerial', data );
      const updatedData = this.updateFormData(data);
      const parsedData = JSON.parse(data)
if(parsedData && parsedData.hasOwnProperty('car'))
{
      const newCoordinate = { x: (parseFloat(parsedData['car']['pose']['pos_m']['X'])+50), y: (parseFloat(parsedData['car']['pose']['pos_m']['Y'])+50)}
console.log('Map newCoordinate ', newCoordinate);
      const newCoordinates = this.state.mapCoordinates
      newCoordinates.push(newCoordinate)
if(updatedData && updatedData.hasOwnProperty('serialData') && updatedData.hasOwnProperty('formData'))
{
      this.setState({ serialData: updatedData.serialData, formData: updatedData.formData, mapCoordinates: newCoordinates })
}
else
{
      this.setState({ mapCoordinates: newCoordinates })
}
}
    });
    socket.on("dataFromJSON", data => { console.log('dataFromJSON', data );
    this.updateFormData(data); this.setState({ serialData: data }) });
    socket.on("map", data => {
      //console.log('map', data );
      const newCoordinates = this.state.mapCoordinates
      newCoordinates.push(data)
      //console.log('newCoordinates', newCoordinates );
      this.setState({ mapCoordinates: newCoordinates })
    });
}

  handleClick(e) {
    console.log("Parent handles child click: set focus to ", e)
    this.setState({focusedItem: e})
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
    console.log('Sending data to serial: ', localData)
    socket.emit('dataFromClient', '[P]' + JSON.stringify(localData))
  }

  editJSON(jsonData, key, value)
  {
    if(typeof(jsonData) !== 'object')
    {
      return jsonData
    }
    if(jsonData)
    {
      var originalMsg = JSON.stringify(jsonData);
      var modifiedKey = key
      var modifiedValue = value
      if(key.includes('checkbox-') === true)
      {
        console.log(`This is a checkbox: ${key}`);
        modifiedKey = key.split('checkbox-')[1]
      }
      var modifedKeyValuePair = '"' + modifiedKey + '":' + modifiedValue.toString()
      var pattern = '"' + modifiedKey + '":[+-]?[0-9]+[.]?[0-9]?'
      if(key.includes('checkbox-') === true)
      {
        pattern = '"' + modifiedKey + '":(true|false)'
        console.log(`This is a checkbox pattern: ${pattern}`);
      }
      let re = new RegExp(pattern)
      console.log('originalMsg', originalMsg)
      console.log(`Pattern: ${pattern} and modifedKeyValuePair: ${modifedKeyValuePair}`);
      console.log(`Testing regexp for string: ${re.test(originalMsg)}`);
      var updatedMsg = originalMsg.replace(re, modifedKeyValuePair);
      console.log('updatedMsg', updatedMsg)
      var newObj = JSON.parse(updatedMsg); 
      console.log('newObj', newObj);
      return newObj
    }
  }

  render() {

  var recursiveTable = null
  var table = []
  //console.log('RENDER this.state.formData', this.state.formData);
  if(typeof this.state.formData === 'object')
  {
    var simpleObjects = getSimpleObjects(this.state.formData, 1)
    //console.log('RENDER simpleObjects', simpleObjects);
    
    if(simpleObjects.length > 5)
    {
      //console.log('generateTable --> getSimpleObjects: ', simpleObjects)
      simpleObjects.forEach(object => {
        //console.log('for each object', object)
        if(object.hasOwnProperty('children') === false) {
          //console.log(object['key'] + ' has no children, value type: '  + typeof object['value'])
          if(typeof object['value'] == 'boolean')
          {
            table.push(<tr key = {'table-'+object['key']}><td>{object['key']}</td><InputField key = {'input-'+object['parent']+object['key']} name={object['key']} value={object['value']} onInputChange={({key, value}) => this.onInputChange({key, value})} onClickParentHandler={(e) => this.handleClick(e)} handleEnter={(e) => this.handleEnter(e)}></InputField></tr>)
          }
          else
          {
            let input = <InputField key = {'input-'+object['parent']+object['key']} name={object['key']} value={object['value']} onInputChange={({key, value}) => this.onInputChange({key, value})} onClickParentHandler={(e) => this.handleClick(e)} handleEnter={(e) => this.handleEnter(e)}></InputField>
            //table.push(<tr><td>{object['key']}</td><td>{object['value']}</td></tr>)
            table.push(input)
          }
        }
        else {
          //console.log(object['parent'] + ' has children')
          var parent = <td>{object['parent']}</td>
          var children = object['children'].map(child => {
            if(child.hasOwnProperty('children') === false)
            {
              var input = <InputField key = {'input-'+object['parent']+child['key']} name={child['key']} value={child['value']} onInputChange={({key, value}) => this.onInputChange({key, value})} onClickParentHandler={(e) => this.handleClick(e)} handleEnter={(e) => this.handleEnter(e)}></InputField>
              return input
              //return <tr><td>{child['key']}</td><td>{child['value']}</td></tr>
            }
            else {
              //getChildren(child)
              //console.log('children', child['children']);
              return <tr key = {'table-'+child['parent']}><td>{child['parent']}</td><td>{child['children'].map(child => {
                //console.log('child', child);
                if(child.hasOwnProperty('children') === false)
                {
                  //console.log('child has no more children');
                  var input = <InputField key = {'input-'+object['parent']+child['key']} name={child['key']} value={child['value']} onInputChange={({key, value}) => this.onInputChange({key, value})} onClickParentHandler={(e) => this.handleClick(e)} handleEnter={(e) => this.handleEnter(e)}></InputField>
                  return input
                  //return <tr><td>{child['key']}</td><td>{child['value']}</td></tr>
                }
                else {
                  //getChildren(child)
                  //console.log('children', child['children']);
                  return <tr key = {'table-'+child['parent']}><td>{child['parent']}</td><td>{child['children'].map(child => {
                    //console.log('child', child);
                    if(child.hasOwnProperty('children') === false)
                    {
                      var input = <InputField key = {'input-'+object['parent']+child['key']} name={child['key']} value={child['value']} onInputChange={({key, value}) => this.onInputChange({key, value})} onClickParentHandler={(e) => this.handleClick(e)} handleEnter={(e) => this.handleEnter(e)}></InputField>
                      return input
                    }
                    else {
                      //getChildren(child)
                      //console.log('children', child['children']);
                      return child['children'].map(child => {
                        return null
                        //console.log('child', child);
                      })
                    } 
                  })}</td></tr>
                } 
              })}</td></tr>
            }
          })
          table.push(<tr key = {'table-'+parent}>{parent}{children}</tr>)
        }
      })
    }
    recursiveTable = <Table striped bordered hover>
      <thead style = {{textAlign: 'center'}}>
        <tr>
          <td colSpan="2">RobonAut form</td>
        </tr>
      </thead>
      <tbody>
        {table}
        <tr style = {{textAlign: 'center'}}>
          <td colSpan="2"><Button variant="info" type="submit" onClick={this.handleSubmit}>Send to serial port</Button></td>
        </tr>
      </tbody>
    </Table>
  }




    //var recursiveTable = generateTable(this.state.formData, this.onInputChange, this.handleEnter, this.handleClick)
    var renderedElements = null
    const { focusedItem } = this.state
    var localJson = null
    focusedItem && console.log("Current focused on rendering: ", focusedItem)
    /*
    this.state.serialData && console.log('hey',  focusedItem, this.state.formData['motorController_Ti'], this.state.serialData['motorController_Ti'])
    if(this.state.serialData && focusedItem !== 'motorController_Ti' && this.state.formData['motorController_Ti'] != this.state.serialData['motorController_Ti'])
    {
      console.log(this.state.formData['motorController_Ti'], this.state.serialData['motorController_Ti'])
      localJson = this.state.formData
      localJson['motorController_Ti'] = this.state.serialData['motorController_Ti']
      this.setState({formData: localJson, serialData: null})
    }
    if(this.state.serialData && focusedItem !== 'motorController_Kc' && this.state.formData['motorController_Kc'] !== this.state.serialData['motorController_Kc'])
    {
      console.log(this.state.formData['motorController_Kc'], this.state.serialData['motorController_Kc'])
      localJson = this.state.formData
      localJson['motorController_Kc'] = this.state.serialData['motorController_Kc']
      this.setState({formData: localJson, serialData: null})
    }
    if(this.state.serialData && focusedItem !== 'frontLineController_P' && this.state.formData['frontLineController_P'] !== this.state.serialData['frontLineController_P'])
    {
      console.log(this.state.formData['frontLineController_P'], this.state.serialData['frontLineController_P'])
      localJson = this.state.formData
      localJson['frontLineController_P'] = this.state.serialData['frontLineController_P']
      this.setState({formData: localJson, serialData: null})
    }
    */
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
            <Col sm={6}>
            <Tabs defaultActiveKey="simpleform" id="uncontrolled-tab-example">
              <Tab eventKey="simpleform" title="Simple form" style = {TabStyle}>
                <SimpleForm socket = {socket} />
                {this.state.serialData && <JsonTree data={this.state.serialData} />}
              </Tab>
              <Tab eventKey="serialviewer" title="Serial data tree viewer" style = {TabStyle}>
                {this.state.serialData && <JsonTree data={this.state.serialData} />}
              </Tab>
              <Tab eventKey="genericform" title="Generic form" style = {TabStyle}>
                {recursiveTable && recursiveTable}
              </Tab>
              <Tab eventKey="map" title="Map" style = {TabStyle}>
                <Map coordinates = {this.state.mapCoordinates} />
              </Tab>
              <Tab eventKey="tree" title="JSON Tree Viewer" style = {TabStyle}>
              <JsonTree data={this.state.formData} />
              </Tab>
            </Tabs>          
            </Col>
            <Col sm={6}>
              <LogViewer socket = {socket} />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
