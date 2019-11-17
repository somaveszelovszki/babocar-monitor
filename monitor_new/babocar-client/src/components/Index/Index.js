import React, { useState } from "react";
import './Index.css';
import CarouselCompontent from '../Carousel/Carousel';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Jumbotron, Image, Accordion, Card, CardDeck, Container, Col, Row } from "react-bootstrap";
import Menu from "../Menu/Menu"
import Footer from "../Footer/Footer"
import card1 from '../../resources/img/card1.jpg';
import card2 from '../../resources/img/card2.jpg';
import card3 from '../../resources/img/card3.jpg';

export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Menu activePage="/" />
        <CarouselCompontent />
        <Container fluid>
          <Row>
            <Col>
              <CardDeck>
                <Card>
                  <Card.Img variant="top" src={card1} />
                  <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                      This is a wider card with supporting text below as a natural lead-in to
                      additional content. This content is a little bit longer.
                </Card.Text>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Img variant="top" src={card2} />
                  <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                      This card has supporting text below as a natural lead-in to additional
                  content.{' '}
                    </Card.Text>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Img variant="top" src={card3} />
                  <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                      This is a wider card with supporting text below as a natural lead-in to
                      additional content. This card has even longer content than the first to
                      show that equal height action.
                </Card.Text>
                  </Card.Body>
                </Card>
              </CardDeck>
            </Col>
          </Row>
        </Container>
        <Footer />
      </div>
    )
  }
}
