import React, { useState } from "react";
import { Carousel, Image } from "react-bootstrap";

import Menu from "../Menu/Menu"
import slide from '../../resources/img/slide.jpg';
import slide2 from '../../resources/img/slide2.jpg';
import slide3 from '../../resources/img/slide3.jpg';

const divStyle = {
  padding: '10px'
}

export default class CarouselCompontent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          index: 0,
          direction: 1
      }
    this.handleSelect = this.handleSelect.bind(this);
    this.setIndex = this.setIndex.bind(this);
    this.setDirection = this.setDirection.bind(this);
    }

    setDirection(direction) {
        this.setState({ direction: direction})
    }

    setIndex(selectedIndex) {
        this.setState({ index: selectedIndex})
    }

    handleSelect(selectedIndex, e) {
        this.setIndex(selectedIndex);
        this.setDirection(e.direction);
    }

    render() {
        return (
            <Carousel activeIndex={this.state.index} direction={this.state.direction} onSelect={this.handleSelect} interval={5000} keyboard ={true} wrap>
              <Carousel.Item>
                <Image
                  className="d-block w-100"
                  src={slide}
                  alt="First slide"
                  fluid
                  style={{width: 500, height: 'auto'}}
                />
                <Carousel.Caption>
                  <h3>First slide label</h3>
                  <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
              <Image
                  className="d-block w-100"
                  src={slide2}
                  alt="Second slide"
                  fluid
                />
        
                <Carousel.Caption>
                  <h3>Second slide label</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
              <Image
                  className="d-block w-100"
                  src={slide3}
                  alt="Third slide"
                  fluid
                />
        
                <Carousel.Caption>
                  <h3>Third slide label</h3>
                  <p>
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          );
    }
}
