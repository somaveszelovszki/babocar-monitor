import React, { useState } from "react";
import App from '../../App';
import About from '../About/About';
import './Menu.css';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Jumbotron, Image } from "react-bootstrap";
import { GoMarkGithub } from 'react-icons/go';
import { FaTwitter, FaInstagram, FaFacebookSquare } from 'react-icons/fa';
import { MdCode } from "react-icons/md";

const menuLinks = [
  { text: "Home", href: "/" },
  { text: "About", href: "/about" },
  { text: "Examples", href: "/examples" },
  { text: "Status page", href: "/status" },
  { text: "Page template", href: "/template" },
  { text: "Codes", href: "/codes" },
  { text: "RobonAUT", href: "/robonaut" },
  {
    text: "Dropdown", children: [
      { text: "Child 1", href: "/childlink1" },
      { text: "Child 2", href: "/childlink2" },
      { divider: true },
      { text: "Child 3", href: "/childlink3" }
    ]
  }
]

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let menuItems = menuLinks.map(menuLink => {
      if (menuLink.hasOwnProperty("children") === true) {
        let dropdownChildren = menuLink.children.map(child => {
          if (child.hasOwnProperty("divider") === true) {
            return <NavDropdown.Divider />
          }
          else {
            return <NavDropdown.Item href={child.href}>{child.text}</NavDropdown.Item>
          }
        })
        return (
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            {dropdownChildren}
          </NavDropdown>
        )
      }
      else {
        return <Nav.Link href={menuLink.href}>{menuLink.text}</Nav.Link>
      }
    })
    const menuBar = (
      <Nav variant="tabs" activeKey={this.props.activePage}>
        {menuItems}
      </Nav>
    )
    return (
      <Navbar bg="dark" expand="lg">
        <Navbar.Brand href="#home"><MdCode />Egyedi szoftverfejlesztés<MdCode /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {menuBar}
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
