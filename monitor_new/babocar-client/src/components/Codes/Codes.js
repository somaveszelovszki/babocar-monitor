import React from "react";
import { Card, CardDeck, Container, Col, Row, Table, Spinner } from "react-bootstrap"; // Necessary react-bootstrap components
import Menu from "../Menu/Menu" // Menu component
import Footer from "../Footer/Footer" // Footer component
import CarouselCompontent from '../Carousel/Carousel'; // Carousel component

/* Page specific resources */
import card1 from '../../resources/img/card1.jpg';
import card2 from '../../resources/img/card2.jpg';
import card3 from '../../resources/img/card3.jpg';

/* Page specific CSS file */
import './Codes.css';

/* Page specific name of the component */
export default class Codes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repositories: [],
    };
  }
  componentDidMount() {

    setTimeout(() => {
      fetch('https://api.github.com/users/bence-sebok/repos')
      .then(response => response.json())
      .then(data => this.setState({ repositories: data }));
    }, 1500)
    
  }
  render() {
    let repositoryElements = null
    let repoTable = null
    console.log(this.state.repositories)
    console.log(repoTable)
    if (this.state.repositories.length > 0) {
      repositoryElements = this.state.repositories.map(repo => {
        return (
          <tr>
            <td width="150px">{repo.name}</td>
            <td width="100px">
              <a href={repo.html_url}>GitHub URL</a>
            </td>
            <td>{repo.description}</td>
          </tr>
        )
      })
      repoTable = (
        <Table striped bordered hover responsive  size="sm">
          <thead>
            <tr>
              <th width="150px">Repository name</th>
              <th width="100px">Repository URL</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {repositoryElements}
          </tbody>
        </Table>
      )
    }
    else {
      repoTable = <Spinner animation="border" variant="primary" />
    }
    return (
      <div>
        <Menu activePage="/codes" />
        <CarouselCompontent />
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <Card.Header>GitHub repositories</Card.Header>
                <Card.Body>
                  <Card.Title>List of our GitHub repositories</Card.Title>
                  <Card.Text>
                    {repoTable}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
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
