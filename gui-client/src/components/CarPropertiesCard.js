import React from 'react';
import { Card, Col, ListGroup, Row } from 'react-bootstrap';


function Property({ name, unit, value, index }) {
    return (
        <ListGroup.Item key={`car-property-${index}`} >
            <Row style={{ padding: 0 }}>
                <Col xs={4} className='text-left font-weight-bold'>
                    {name}
                </Col>
                <Col xs={5} style={{ padding: 0 }} className='text-right'>
                    {value}
                </Col>
                <Col xs={3} style={{ paddingLeft: '0.5rem' }} className='text-left'>
                    {unit}
                </Col>
            </Row>
        </ListGroup.Item >
    )
}

export default function CarPropertiesCard({ car }) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>Car</Card.Title>
                <ListGroup>
                    <Property name="X" unit="m" value={car.pos_m?.x.toFixed(2)} index='0' />
                    <Property name="Y" unit="m" value={car.pos_m?.y.toFixed(2)} index='1' />
                    <Property name="Angle" unit="deg" value={car.angle_deg ? car.angle_deg.toFixed(2) : null} index='2' />
                    <Property name="Speed" unit="m/s" value={car.speed_mps?.toFixed(2)} index='3' />
                </ListGroup>
            </Card.Body>
        </Card>
    )
}
