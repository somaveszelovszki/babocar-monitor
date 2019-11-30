import React, { useState } from "react";
import { Container, CardDeck, ButtonToolbar, Navbar, Nav, NavDropdown, Form, FormControl, Button, Jumbotron, Image, Accordion, Card, Badge } from "react-bootstrap";
import { GoMarkGithub } from 'react-icons/go';
import { FaTwitter, FaInstagram, FaFacebookSquare } from 'react-icons/fa';
import { MdCode } from "react-icons/md";
import "./Examples.css"

import Menu from "../Menu/Menu"

const divStyle = {
  padding: '10px'
}

export default class Example extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
        return (
        <div>
        <Menu activePage = "/examples" />
        <Container fluid>
          <Accordion defaultActiveKey="1">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                Badges
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <Card.Title>Different versions of badges</Card.Title>
                  <h1>
                      Example heading <Badge variant="secondary">New</Badge>
                  </h1>
                  <h2>
                      Example heading <Badge variant="secondary">New</Badge>
                  </h2>
                  <h3>
                      Example heading <Badge variant="secondary">New</Badge>
                  </h3>
                  <h4>
                      Example heading <Badge variant="secondary">New</Badge>
                  </h4>
                  <h5>
                      Example heading <Badge variant="secondary">New</Badge>
                  </h5>
                  <h6>
                      Example heading <Badge variant="secondary">New</Badge>
                  </h6>
                  <h2>Badges in Buttons</h2>
                  <Button variant="primary">
                      Profile <Badge variant="light">9</Badge>
                      <span className="sr-only">unread messages</span>
                  </Button>
                  <h2>Badge variants</h2>
                  <div>
                      <Badge variant="primary">Primary</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="danger">Danger</Badge>
                      <Badge variant="warning">Warning</Badge>
                      <Badge variant="info">Info</Badge>
                      <Badge variant="light">Light</Badge>
                      <Badge variant="dark">Dark</Badge>
                  </div>
                  <h2>Badge variants with pill</h2>
                  <div>
                      <Badge pill variant="primary">
                          Primary
                      </Badge>
                      <Badge pill variant="secondary">
                          Secondary
                      </Badge>
                      <Badge pill variant="success">
                          Success
                      </Badge>
                      <Badge pill variant="danger">
                          Danger
                      </Badge>
                      <Badge pill variant="warning">
                          Warning
                      </Badge>
                      <Badge pill variant="info">
                          Info
                      </Badge>
                      <Badge pill variant="light">
                          Light
                      </Badge>
                      <Badge pill variant="dark">
                          Dark
                      </Badge>
                  </div>
                  <h1>Buttons</h1>
                  <ButtonToolbar>
                      <Button variant="primary">Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="success">Success</Button>
                      <Button variant="warning">Warning</Button>
                      <Button variant="danger">Danger</Button>
                      <Button variant="info">Info</Button>
                      <Button variant="light">Light</Button>
                      <Button variant="dark">Dark</Button>
                      <Button variant="link">Link</Button>
                  </ButtonToolbar>
                </Card.Body>
              </Accordion.Collapse>
           </Card>

          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="1">
              Card decks
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <div style = {divStyle}>
              <CardDeck>
                <Card bg="primary" text="white" style={{ width: '18rem' }}>
                    <Card.Header>Featured</Card.Header>
                    <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                        This is a wider card with supporting text below as a natural lead-in to
                        additional content. This content is a little bit longer.
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                <Card bg="secondary" text="white" style={{ width: '18rem' }}>
                    <Card.Header>Featured</Card.Header>
                    <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                        This card has supporting text below as a natural lead-in to additional
                        content.{' '}
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                <Card bg="success" text="white" style={{ width: '18rem' }}>
                    <Card.Header>Featured</Card.Header>
                    <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                        This is a wider card with supporting text below as a natural lead-in to
                        additional content. This card has even longer content than the first to
                        show that equal height action.
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                <Card bg="danger" text="white" style={{ width: '18rem' }}>
                    <Card.Header>Featured</Card.Header>
                    <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                        This is a wider card with supporting text below as a natural lead-in to
                        additional content. This content is a little bit longer.
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
            </CardDeck>
            <CardDeck>
            <Card bg="warning" text="white" style={{ width: '18rem' }}>
                    <Card.Header>Featured</Card.Header>
                    <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                        This is a wider card with supporting text below as a natural lead-in to
                        additional content. This content is a little bit longer.
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                <Card bg="info" text="white" style={{ width: '18rem' }}>
                    <Card.Header>Featured</Card.Header>
                    <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                        This card has supporting text below as a natural lead-in to additional
                        content.{' '}
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                <Card bg="dark" text="white" style={{ width: '18rem' }}>
                    <Card.Header>Featured</Card.Header>
                    <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                        This is a wider card with supporting text below as a natural lead-in to
                        additional content. This card has even longer content than the first to
                        show that equal height action.
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                <Card bg="light" style={{ width: '18rem' }}>
                    <Card.Header>Featured</Card.Header>
                    <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                        This is a wider card with supporting text below as a natural lead-in to
                        additional content. This content is a little bit longer.
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
            </CardDeck>
            </div>
            </Accordion.Collapse>
          </Card>
          </Accordion>
        </Container>
        </div>
        )
    }
}
