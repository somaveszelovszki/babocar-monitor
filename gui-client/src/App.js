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
    // Logging-related states
    const [logs, setLogs] = React.useState([]);
    const [logsToRender, setLogsToRender] = React.useState([]);
    const [selectedLogLevel, setSelectedLogLevel] = React.useState(null);

    const [params, setParams] = React.useState({});
    const [trackControl, setTrackControl] = React.useState({ type: null, sections: {} });

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
                    // TODO: should we only store the logs which are filtered by the selected log level?
                    setLogs((logs) => utils.unshiftFIFO(logs, JSON.parse(msg.message), 200));
                    break;

                case 'babocar/params':
                    setParams((params) => {
                        const p = { ...params };
                        _.extend(p, JSON.parse(msg.message));
                        return p;
                    });
                    break;

                case 'babocar/track-control':
                    setTrackControl((trackControl) => {
                        const section = JSON.parse(msg.message);
                        return section.type === trackControl.type ? {
                            type: section.type,
                            sections: {
                                ...trackControl.sections,
                                [section.name]: section.control
                            }
                        } : { type: section.type, sections: { [section.name]: section.control } };
                    });
                    break;

                default:
                    console.log(`Unhandled topic: ${msg.topic}`);
            }
        });

        return () => socket.off('message');
    }, []);

    React.useEffect(() => {
        publish('babocar/request-params', {});
        publish('babocar/request-track-control', {});
    }, [publish]);

    const publishParams = React.useCallback((param) => {
        publish('babocar/update-params', param);
    }, [publish]);

    const publishTrackControl = React.useCallback((trackControl) => {
        const name = Object.keys(trackControl)[0];
        publish('babocar/update-track-control', { name, control: trackControl[name] });
    }, [publish]);

    // Optional log filtering based on the selected level
    React.useEffect(() => {
        // Preparing time measurement
        const now = new Date().getTime();
        console.time(`logs-filtering-${now}`);

        // Optional filtering
        let logsToStore = logs;
        if (selectedLogLevel) {
            logsToStore = logs.filter(log => log.level === selectedLogLevel);
        }

        // Display time measurement
        console.timeEnd(`logs-filtering-${now}`);

        // Update state variable
        setLogsToRender(logsToStore);
    }, [logs, selectedLogLevel])

    return (
        <div className='app'>
            <Container fluid>
                <Row>
                    <Col>
                        <Header isDirectControlEnabled={car.isRemoteControlled} />
                    </Col>
                </Row>
                <Row>
                    <Col md={3} xl={3}>
                        <Row>
                            <Col>                            
                                <CarPropertiesCard car={car} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <ParameterEditorCard params={params} sendParams={publishParams} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <MapCard car={car} />
                            </Col>
                        </Row>
                    </Col>

                    <Col md={9} xl={9}>
                        <Row>
                            <Col xl={7} className='order-xs-2 order-xl-1'>
                                <Row>
                                    <Col>
                                        <TrackControlCard trackControl={trackControl} sendTrackControl={publishTrackControl} />
                                    </Col>
                                </Row>
                            </Col>

                            <Col xl={5} className='order-xs-1 order-xl-2'>
                                <Row>
                                    <Col>
                                        <LogCard
                                            logs={logsToRender}
                                            setLogs={setLogs}
                                            selectedLogLevel={selectedLogLevel}
                                            setSelectedLogLevel={setSelectedLogLevel}
                                        />
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
