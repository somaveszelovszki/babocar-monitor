import React from "react";
import { Accordion, Card, ListGroup, Button, Alert } from "react-bootstrap"; // Necessary react-bootstrap components

export default class StatusBar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
        <ListGroup horizontal>
            <ListGroup.Item>X: {this.props.posX || "null"}</ListGroup.Item>
            <ListGroup.Item>Y: {this.props.posX || "null"}</ListGroup.Item>
            <ListGroup.Item>Angle: {`${this.props.angle} °` || "null"}</ListGroup.Item>
            <ListGroup.Item>Speed: {`${this.props.speed} mps` || "null"}</ListGroup.Item>
        </ListGroup>
        )
  }
}
