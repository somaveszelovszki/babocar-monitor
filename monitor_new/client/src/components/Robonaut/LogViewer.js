import React from "react";
import { Accordion, Card, ListGroup, Button } from "react-bootstrap"; // Necessary react-bootstrap components
import socketIOClient from "socket.io-client";
import './Robonaut.css';

const maxLength = 200

const ListStyle = {
  maxHeight: '800px',
  marginBottom: '10px',
  overflow: 'scroll'
}

export default class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numLogs: 0,
      logs: ['[D] Log message 1', '[E] Log message 2', '[W] Log message 3', '[I] Log message 4', '[D]  Log message 5', '[E] Log message 6', '[W] Log message 7', '[I] Log message 8']
    }
  }
  getColor(type)
  {
    let variant
    if(type === '[E]')
    {
      variant = "danger"
    }
    else if(type === '[W]')
    {
      variant = "warning"
    }
    else if(type === '[I]')
    {
      variant = "info"
    }
    else if(type === '[D]')
    {
      variant = "dark"
    }
    else
    {
      variant = null
    }
    return variant
  }
  addElement()
  {
    var newArray = this.state.logs;
    newArray.unshift('Log message ' + (this.state.logs.length+1));
    if(this.state.logs.length > maxLength)
    {
      newArray.pop()
    }
    this.setState({ logs: newArray });
    // <Button variant="success" style = {{marginBottom: '5px', marginLeft: '5px'}} onClick = {() => {this.addElement()}}>Insert</Button>
  }
  componentDidMount() {
    // log scroll
    // színekkel
    // prio
    // E - danger
    // W - warning
    // I - info
    // D - dark
    // remove letter becasue of the colors
    // ring buffer: 200
    console.log('LogViewer has mounted.');
    this.props.socket.on("logFromSerial", data => {
      console.log('logFromSerial', data);
      var newArray = this.state.logs;
      newArray.unshift(data);
      if(this.state.logs.length > maxLength)
      {
        newArray.pop()
      }
      this.setState({ logs: newArray });
      /*
        console.log(JSON.parse(data));
        var newArray = this.state.logs;
        newArray.push(JSON.parse(data));
        this.setState({ logs: newArray });
        */
    });
  }
  render() {
      var logListItems = this.state.logs.map((log, index) => {
          let messageType = log.substring(0, 3)
          let variant = this.getColor(messageType)
          log = log.substring(3)
          return <ListGroup.Item variant={variant}>Log #{index+1}: {log}</ListGroup.Item>
      })
    return (
        <div>
        <Accordion defaultActiveKey="0" style = {{borderBottom: '1px solid rgba(0, 0, 0, .125)'}}>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                    Logs
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                <Card.Body>
                    <Button variant="danger" style = {{marginBottom: '5px'}} onClick = {() => {this.setState({logs: []})}}>Reset</Button>
                    <ListGroup style = {ListStyle}>
                        {this.state.logs.length > 0 ? logListItems : "There are no logs."}
                    </ListGroup>
                </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        </div>
    )
  }
}
