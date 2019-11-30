import React, { useState } from "react";
import { Container, ProgressBar, CardColumns, Card, Jumbotron, Col, Row, ListGroup } from "react-bootstrap";

import Menu from "../Menu/Menu"

const divStyle = {
    margin: '10px'
}

const progress = {
    margin: '10px'
}

export default class Status extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Menu activePage="/status" />
                <Container fluid>
                    <Row className="justify-content-md-center">
                        <Col xs lg="11">
                            <CardColumns>
                                <Card className="text-center" style={{ width: '75rem' }}>
                                    <Card.Header>Current progress of the website development</Card.Header>
                                    <Card.Body>
                                        <Card.Title>Status bars</Card.Title>
                                        <Card.Text>
                                            <ListGroup>
                                                <ListGroup.Item variant="primary">
                                                    <Container>
                                                        <Row>
                                                            <Col>Title 1</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={1}>Step 1</Col>
                                                            <Col><ProgressBar animated striped variant="primary" now={40} label="40%" style={progress} /></Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={1}>Step 2</Col>
                                                            <Col><ProgressBar animated striped variant="primary" now={55} label="55%" style={progress} /></Col>
                                                        </Row>
                                                    </Container>
                                                </ListGroup.Item>
                                                <ListGroup.Item variant="success">
                                                    <Container>
                                                        <Row>
                                                            <Col>Title 2</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={1}>Step 1</Col>
                                                            <Col><ProgressBar animated striped variant="success" now={10} label="10%" style={progress} /></Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={1}>Step 2</Col>
                                                            <Col><ProgressBar animated striped variant="success" now={90} label="90%" style={progress} /></Col>
                                                        </Row>
                                                    </Container>
                                                </ListGroup.Item>
                                                <ListGroup.Item variant="info">
                                                    <Container>
                                                        <Row>
                                                            <Col>Title 3</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={1}>Step 1</Col>
                                                            <Col><ProgressBar animated striped variant="info" now={35} label="35%" style={progress} /></Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={1}>Step 2</Col>
                                                            <Col><ProgressBar animated striped variant="info" now={95} label="95%" style={progress} /></Col>
                                                        </Row>
                                                    </Container>
                                                </ListGroup.Item>
                                                <ListGroup.Item variant="warning">
                                                    <Container>
                                                        <Row>
                                                            <Col>Title 4</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={1}>Step 1</Col>
                                                            <Col><ProgressBar animated striped variant="warning" now={47} label="47%" style={progress} /></Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={1}>Step 2</Col>
                                                            <Col><ProgressBar animated striped variant="warning" now={23} label="23%" style={progress} /></Col>
                                                        </Row>
                                                    </Container>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer className="text-muted">Updated 2 days ago</Card.Footer>
                                </Card>
                            </CardColumns>
                        </Col>
                    </Row>

                </Container>
            </div>
        )
    }
}
