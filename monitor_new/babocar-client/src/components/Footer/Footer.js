import React, { useState } from "react";
import { GoMarkGithub } from 'react-icons/go';
import { FaTwitter, FaInstagram, FaFacebookSquare } from 'react-icons/fa';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Jumbotron, Image, Accordion, Card, CardDeck, Container, Col, Row } from "react-bootstrap";
import { MdCode } from "react-icons/md";
import './Footer.css';

export default class Footer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <footer className="customFooter">
                <Container fluid>
                    <Row>
                        <Col lg={4}>
                            <h5>Our Company</h5>
                            <ul className="list-unstyled text-small">
                                <li>Copyright @ 2019 Cég Kft.</li>
                                <li>Address: Country, City, Street</li>
                            </ul>
                        </Col>
                        <Col lg={3}>
                            <h5>Social Media</h5>
                            <a className="social-icon" href="#"><GoMarkGithub size={40} /></a>
                            <a className="social-icon" href="#"><FaTwitter size={40} /></a>
                            <a className="social-icon" href="#"><FaInstagram size={40} /></a>
                            <a className="social-icon" href="#"><FaFacebookSquare size={40} /></a>
                        </Col>
                        <Col lg={5}>
                            <h5>Solutions</h5>
                            <ul className="list-unstyled text-small">
                                <li>Backend</li>
                                <li>Frontend</li>
                                <li>Database</li>
                                <li>Design</li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </footer>

        )
    }
}
