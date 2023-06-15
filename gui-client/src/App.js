import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import socketIO from 'socket.io-client';

import './style.css';
import * as utils from './Utils';
import CarPropertiesCard from './components/CarPropertiesCard';
import Header from './components/Header'
import LogCard from './components/LogCard'
import MapCard from './components/MapCard'
import ParameterEditorCard from './components/ParameterEditorCard'
import TrackControlCard from './components/TrackControlCard';

const socket = socketIO.connect('http://localhost:3001');

socket.emit('subscribe', 'car');
socket.emit('subscribe', 'log');
socket.emit('subscribe', 'params');
socket.emit('subscribe', 'track-control');

export default function App() {
    const [car, setCar] = React.useState({ pos_m: null, angle_rad: null, speed_mps: null });
    const [logs, setLogs] = React.useState([]);
    const [paramsIn, setParamsIn] = React.useState({});
    const [paramsOut, setParamsOut] = React.useState(paramsIn);
    const [trackControlIn, setTrackControlIn] = React.useState({ type: null, sections: [] });
    const [trackControlOut, setTrackControlOut] = React.useState(trackControlIn);

    React.useEffect(() => {
        socket.on('feed', (json) => {
            console.log(`Received feed: ${json}`);
            const msg = JSON.parse(json);
            switch (msg.channel) {
                case 'car':
                    setCar(msg.car);
                    break;

                case 'log':
                    setLogs((logs) => utils.unshiftFIFO(logs, msg.log, 200));
                    break;

                case 'params':
                    setParamsIn((paramsIn) => {
                        const newParams = { ...paramsIn };
                        Object.keys(msg.params).map((key) => newParams[key] = msg.params[key]);
                        return newParams;
                    });
                    break;

                case 'track-control':
                    setTrackControlIn(msg.trackControl);
                    break;

                default:
                    console.log(`Received feed from unhandled channel: ${msg.channel}`);
            }
        });

        return () => socket.off('feed');
    }, []);

    React.useEffect(() => {
        socket.emit('send', JSON.stringify({
            channel: 'update-params',
            params: paramsOut
        }));
    }, [paramsOut]);

    React.useEffect(() => {
        socket.emit('send', JSON.stringify({
            channel: 'update-track-control',
            trackControl: trackControlOut
        }));
    }, [trackControlOut]);

    return (
        <div className='app'>
            <Container fluid>
                <Row>
                    <Col>
                        <Header isDirectControlEnabled={car.isRemoteControlled} />
                    </Col>
                </Row>
                <Row>
                    <Col md={6} xl={5}>
                        <Row>
                            <Col xl={6}>
                                <CarPropertiesCard car={car} />
                            </Col>
                            <Col xl={6}>
                                <ParameterEditorCard paramsIn={paramsIn} setParamsOut={setParamsOut} />
                            </Col>
                        </Row>
                    </Col>

                    <Col md={6} xl={7}>
                        <Row>
                            <Col xl={6} className='order-xs-2 order-xl-1'>
                                <Row>
                                    <Col>
                                        <TrackControlCard trackControlIn={trackControlIn} setTrackControlOut={setTrackControlOut} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <MapCard car={car} />
                                    </Col>
                                </Row>
                            </Col>

                            <Col xl={6} className='order-xs-1 order-xl-2'>
                                <Row>
                                    <Col>
                                        <LogCard logs={logs} setLogs={setLogs} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>

                </Row>
            </Container>
        </div>
    );
}
