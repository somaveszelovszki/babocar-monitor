import React from "react";
import { Container, Col, Row, Button, Tabs, Tab } from "react-bootstrap"; // Necessary react-bootstrap components
import socketIOClient from "socket.io-client";
import RefactoredForm from './RefactoredForm'
import LogViewer from './LogViewer'
import Header from './Header'
import ParameterLineChart from './ParameterLineChart'
import Labyrinth from './Labyrinth'

const socket = socketIOClient(process.env.REACT_APP_SERVER_IP_WITH_PORT || "10.42.0.39:3001");

var counter = 1

const TabStyle = {
  border: '1px solid rgba(0, 0, 0, .125)',
  borderBottomRightRadius: '.25rem',
  borderBottomLeftRadius: '.25rem',
  padding: '15px',
  marginBottom: '5px'
}

export default class GuiApplication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChartEnabled: false,
      chartData: [],
      counter: 0,
      controllerButtonMode: 'enable',
      jsonFile: null,
      focusedItem: { key: 'motorCtrl_integral_max', value: 5 },
      formData: {
        "car": {
          "pose": {
            "pos": {
              "X": 1.0000,
              "Y": 2.0000
            },
            "angle_deg": 45,
            "pose_m": {
              "X": 1.0000,
              "Y": 2.0000
            },
            "angle": 5.5793
          },
          "speed": -23.5300,
          "speed_mps": 12.4,
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
      mapCoordinates: [],
      isRemoteControlled: false,
      checkedFields: [],
      isLabyrinthEnabled: false
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
    this.addDataToCharts = this.addDataToCharts.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleIsRemoteControlled = this.handleIsRemoteControlled.bind(this)
    this.addFormDataToChart = this.addFormDataToChart.bind(this)
    this.deleteHistoryFromChart = this.deleteHistoryFromChart.bind(this)
    this.toggleLabyrinth = this.toggleLabyrinth.bind(this)
  }

  handleIsRemoteControlled(isRemoteControlled) {
    this.setState({ isRemoteControlled: isRemoteControlled })
  }

  updateValue()
  {  
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
    if(inputData.hasOwnProperty(input.key)) {}
    else {
      for (let [key, value] of Object.entries(inputData)) {
        if(typeof(value) === 'object')
        {
          if(isNaN(parseFloat(input.value)) === true) {
            inputData[key][input.key] = parseFloat(input.value).toFixed(4)
          }
          inputData[key][input.key] = parseFloat(input.value).toFixed(4)
        }
      }
    }
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
      this.setState({ formData: parsedJSON, focusedItem: { key: input.key, value: input.value } }, console.log('updated formData', this.state.formData))
    }
    catch(e)
    {
      if(e instanceof SyntaxError) {
        console.error(e.message);
      }
      else {
        console.error(e)
      }
    }
  }
  
  updateFormData(serialData)
  {
    if(typeof(serialData) !== 'object')
    {
      // error handling?
    }
    if(serialData && this.state.focusedItem)
    {
      var originalMsg = JSON.stringify(serialData);
      const lockedItem = this.state.focusedItem
      const modifedKeyValuePair = '"' + lockedItem.key + '":' + lockedItem.value.toString()
      const pattern = '"' + lockedItem.key + '":[+-]?[0-9]+[.]?[0-9]*'
      let re = new RegExp(pattern)
      var updatedMsg = originalMsg.replace(re, modifedKeyValuePair);
      var newObj = JSON.parse(updatedMsg); 
      return {
        serialData: JSON.parse(originalMsg),
        formData: newObj
      }
    }
  }

  addDataToCharts() {
    if(this.state.isChartEnabled) {
      const RADIAN = Math.PI / 180;
      const sin = Math.sin(2 * RADIAN * (this.state.counter * 300));
      this.setState(prevState => ({
        chartData: [
          ...prevState.chartData, 
          {
            'speed': this.state.counter + 1,
            'angle': (this.state.counter + 1) % 6,
            'sin': sin
          }
        ],
        counter: this.state.counter + 1
      }))
      console.log('chartData', this.state.chartData);
    }
  }

  addFormDataToChart = (newData) => {
    if(this.state.isChartEnabled) {
      //console.log('addFormDataToChart', newData);
      const transformedData = {}
      newData.forEach(data => {
        transformedData[data[0]] = data[1]
      })
      this.setState(prevState => ({
        chartData: [
          ...prevState.chartData, 
          transformedData
        ],
      }))
      console.log('chartData', this.state.chartData);
    }
  }

  componentDidMount() {
    socket.on("logFromSerial", data => {
      if(data.includes('currentSeg') === true)
      {
        const junctionNumber = parseInt(data.split('junction: ')[1].split(' ')[0])
        const x = data.split(' (')[1].split(',')[0]
        const y = data.split(' (')[1].split(',')[1].split(')')[0]
        const newCoordinate = { x: x, y: y, junction: junctionNumber }
        const newCoordinates = this.state.mapCoordinates
        newCoordinates.push({ x: Math.floor(newCoordinate.x), y: Math.floor(newCoordinate.y), junction: junctionNumber })
        this.setState({ mapCoordinates: newCoordinates })
      }
    })
    /*
    socket.on("dataFromSerial", rawData => {
      console.log('dataFromSerial', typeof(rawData), rawData);
      const data = typeof(rawData) !== 'object' ? JSON.parse(rawData) : rawData;
    });
    */
    /*
      const updatedData = this.updateFormData(data);
      const newCoordinate = {
        x: Math.round(data['car']['pose']['pos_m']['X'] * 100),
        y: Math.round(data['car']['pose']['pos_m']['Y'] * 100)
      }
      const newCoordinates = this.state.mapCoordinates
      var inArray = false
      newCoordinates.forEach((element) => {
        if(Math.floor(element.x) === Math.floor(newCoordinate.x) && Math.floor(element.y) === Math.floor(newCoordinate.y)) {
          inArray = true
        }
      })
      if(inArray === false)
      {
        if(data.hasOwnProperty('junction')) {
          newCoordinates.push({ x: Math.floor(newCoordinate.x), y: Math.floor(newCoordinate.y), junction: data['junction'] })
        }
        else {
          newCoordinates.push({ x: Math.floor(newCoordinate.x), y: Math.floor(newCoordinate.y) })
        }
        this.setState({ serialData: updatedData.serialData, formData: updatedData.formData, mapCoordinates: newCoordinates })
      }
      else {
        this.setState({ serialData: updatedData.serialData, formData: updatedData.formData })
      }
    });
    */
    /*
    socket.on("dataFromJSON", data => {
      const updatedData = this.updateFormData(data);
      this.setState({ serialData: updatedData.serialData, formData: updatedData.formData })
    });
    */
    socket.on("map", data => {
      const newCoordinates = this.state.mapCoordinates
      var inArray = false
      newCoordinates.forEach((element) => {
        if(Math.floor(element.x) === Math.floor(data.x) && Math.floor(element.y) === Math.floor(data.y)) {
          inArray = true
        }
      })
      if(inArray === false) {
        newCoordinates.push({ x: Math.floor(data.x), y: Math.floor(data.y) })
        this.setState({ mapCoordinates: newCoordinates })
      }
    });
    //this.timerID = setInterval(this.addDataToCharts, 1000)
  }

  componentWillUnmount() {
    //clearInterval(this.timerID)
  }

  handleClick(e) {
    this.setState({focusedItem: e})
  }

  handleEnter(event) {
    if(event.key === 'Enter')
    {
      console.log("Enter key pressed. Submit form to serial port.")
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
    console.log('Sending data to serial: ', localData)
    socket.emit('dataFromClient', '[P]' + JSON.stringify(localData))
  }

  editJSON(jsonData, key, value) {
    if(typeof(jsonData) !== 'object') {
      return jsonData
    }
    if(jsonData) {
      var originalMsg = JSON.stringify(jsonData);
      var modifiedKey = key
      var modifiedValue = value
      if(key.includes('checkbox-') === true) {
        modifiedKey = key.split('checkbox-')[1]
      }
      var modifedKeyValuePair = '"' + modifiedKey + '":' + modifiedValue.toString()
      var pattern = '"' + modifiedKey + '":[+-]?[0-9]+[.]?[0-9]?'
      if(key.includes('checkbox-') === true) {
        pattern = '"' + modifiedKey + '":(true|false)'
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

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  deleteHistoryFromChart() {
    this.setState({ chartData: [] })
  }

  toggleLabyrinth(event) {
    //console.log('gui toggleLabyrinth', this.state.isLabyrinthEnabled, event.target.checked);
    this.setState({ isLabyrinthEnabled: event.target.checked })
    // this.setState(prevState => ({
    //   isLabyrinthEnabled: !prevState.isLabyrinthEnabled
    // }));
  }

  toggleChart(event) {
    this.setState({ isChartEnabled: event.target.checked })
  }

  render() {
    return (
      <div>
        <Container fluid style = {{ position: 'relative' }}>
          <Header
            posX = {this.state.formData['car']['pose']['pose_m']['X']}
            posY = {this.state.formData['car']['pose']['pose_m']['Y']}
            angle = {this.state.formData['car']['pose']['angle_deg']}
            speed = {this.state.formData['car']['speed_mps']}
            controllerButtonMode = {this.state.isRemoteControlled}
            isLabyrinthEnabled = {this.state.isLabyrinthEnabled}
            toggleLabyrinth = {(event) => this.toggleLabyrinth(event)}
            isChartEnabled = {this.state.isChartEnabled}
            toggleChart = {(event) => this.toggleChart(event)}
          />
          <Row>
            <Col style = {{ marginBottom: '10px' }}>
            {this.state.isLabyrinthEnabled === true && (
              <Labyrinth
                size = {22}
                socket = {socket}
              />
            )}
            </Col>
          </Row>
        <Row>
            <Col sm={6}>
            <Tabs defaultActiveKey="refactoredFrom" id="uncontrolled-tab-example">
              <Tab eventKey="refactoredFrom" title="Refactored form" style = {TabStyle}>
                <RefactoredForm
                  socket = {socket}
                  forwardisRemoteControlled = {this.handleIsRemoteControlled}
                  addFormDataToChart = {this.addFormDataToChart}
                  deleteHistoryFromChart = {this.deleteHistoryFromChart}
                />
              </Tab>
              {/*
              <Tab eventKey="map" title="Map" style = {TabStyle}>
                <Map coordinates = {this.state.mapCoordinates} />
              </Tab>
              */}
            </Tabs>  
            </Col>
            <Col sm={6}>
              <div>
	              <LogViewer socket = {socket} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12} style = {{ height: 600 }}>
              <div style = {{ textAlign: 'center' }}>
                {this.state.isChartEnabled && (
                  <Button
                    variant="danger"
                    onClick={() => this.setState({ chartData: [] })}
                    style = {{ marginLeft: '10px' }}
                  >
                    Clear chart data
                  </Button>
                )}
              </div>
              { this.state.isChartEnabled && <ParameterLineChart data = {this.state.chartData} /> }
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
