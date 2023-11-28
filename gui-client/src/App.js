import * as _ from 'lodash'
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

export default function App() {
    const [car, setCar] = React.useState({ pos_m: null, angle_deg: null, speed_mps: null });
    const [logs, setLogs] = React.useState([]);
    const [paramsIn, setParamsIn] = React.useState({});
    const [paramsOut, setParamsOut] = React.useState(paramsIn);
    const [trackControlIn, setTrackControlIn] = React.useState({ type: null, sections: [] });
    const [trackControlOut, setTrackControlOut] = React.useState(trackControlIn);

    const publish = React.useCallback((topic, data) => {
        socket.emit('publish', JSON.stringify({ topic, message: JSON.stringify(data) }));
    }, []);

    React.useEffect(() => {
        socket.on('message', (json) => {
            const msg = JSON.parse(json);
            switch (msg.topic) {
                case 'babocar/car':
                    setCar(JSON.parse(msg.message));
                    break;

                case 'babocar/log':
                    setLogs((logs) => utils.unshiftFIFO(logs, JSON.parse(msg.message), 200));
                    break;

                case 'babocar/params':
                    setParamsIn((paramsIn) => {
                        const p = { ...paramsIn };
                        _.extend(p, JSON.parse(msg.message));
                        return p;
                    });
                    break;

                case 'babocar/track-control':
                    setTrackControlIn(JSON.parse(msg.message));
                    break;

                default:
                    console.log(`Unhandled topic: ${msg.topic}`);
            }
        });

        return () => socket.off('message');
    }, []);

    React.useEffect(() => {
        if (!_.isEmpty(paramsOut)) {
            publish('babocar/update-params', paramsOut);
        }
    }, [paramsOut, publish]);

    React.useEffect(() => {
        if (trackControlOut.type && !_.isEmpty(trackControlOut.sections)) {
            publish('babocar/update-track-control', trackControlOut);
        }
    }, [trackControlOut, publish]);

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
