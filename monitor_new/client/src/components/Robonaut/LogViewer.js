import React from "react";
import { Accordion, Card, ListGroup, Button } from "react-bootstrap"; // Necessary react-bootstrap components
import socketIOClient from "socket.io-client";
import './Robonaut.css';

export default class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: ['log1', 'log2', 'log3']
    }
  }
  componentDidMount() {
    console.log('LogViewer has mounted.');
    this.props.socket.on("logFromSerial", data => {
      console.log('logFromSerial', data);
      var newArray = this.state.logs;
      newArray.unshift(data);
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
      var logListItems = this.state.logs.map(log => {
          return <ListGroup.Item>{log}</ListGroup.Item>
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
                    <ListGroup>
                        {this.state.logs.length > 0 ? logListItems : "There are no logs."}
                    </ListGroup>
                </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        <Button variant="danger" style = {{marginTop: '5px'}} onClick = {() => {this.setState({logs: []})}}>Reset</Button>
        </div>
    )
  }
}
