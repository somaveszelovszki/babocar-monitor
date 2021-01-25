import React from "react";
import { ListGroup } from "react-bootstrap"; // Necessary react-bootstrap components

export default class StatusBar extends React.Component {

    toggleLabyrinth(event) {
        this.props.toggleLabyrinth(event)
    }

    toggleChart(event) {
        this.props.toggleChart(event)
    }

    toggleMap(event) {
        this.props.toggleMap(event)
    }

    render() {
        //console.log('render', this.props.isLabyrinthEnabled);
        return (
        <ListGroup horizontal>
            <ListGroup.Item variant = {this.props.isLabyrinthEnabled ? "success" : "dark" }>
                Labyrinth
                <input
                    name="labyrinth"
                    type="checkbox"
                    checked={this.props.isLabyrinthEnabled}
                    onChange={(event) => this.toggleLabyrinth(event)}
                    style={{ marginLeft: '10px' }}
                />
            </ListGroup.Item>
            <ListGroup.Item variant = {this.props.isChartEnabled ? "success" : "dark" }>
                Chart
                <input
                    name="chart"
                    type="checkbox"
                    checked={this.props.isChartEnabled}
                    onChange={(event) => this.toggleChart(event)}
                    style={{ marginLeft: '10px' }}
                />
            </ListGroup.Item>
            <ListGroup.Item variant = {this.props.isMapEnabled ? "success" : "dark" }>
                Map
                <input
                    name="labyrinth"
                    type="checkbox"
                    checked={this.props.isMapEnabled}
                    onChange={(event) => this.toggleMap(event)}
                    style={{ marginLeft: '10px' }}
                />
            </ListGroup.Item>
            <ListGroup.Item>X: {this.props.posX || "null"}</ListGroup.Item>
            <ListGroup.Item>X: {this.props.posX || "null"}</ListGroup.Item>
            <ListGroup.Item>Y: {this.props.posX || "null"}</ListGroup.Item>
            <ListGroup.Item>Angle: {`${this.props.angle} °` || "null"}</ListGroup.Item>
            <ListGroup.Item>Speed: {`${this.props.speed} mps` || "null"}</ListGroup.Item>
        </ListGroup>
        )
  }
}
