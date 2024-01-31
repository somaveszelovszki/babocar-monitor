import * as _ from 'lodash'
import React, { useEffect } from 'react';
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
import PirateCarPropertiesCard from './components/PirateCarPropertiesCard';

const messagesToIgnore = [
    'Control data timed out'
]

const socket = socketIO.connect(process.env.REACT_APP_SOCKET_ADDRESS);

// Flood-related config
const FLOOD_MESSAGE_TO_SERIAL = "FLOOD!";
const FLOOD_PERIOD_TIME_IN_MS = 200;

export default function App() {
    const [car, setCar] = React.useState({ pos_m: null, angle_deg: null, speed_mps: null });
    // Logging-related states
    const [logs, setLogs] = React.useState([]);
    const [logsToRender, setLogsToRender] = React.useState([]);
    const [selectedLogLevel, setSelectedLogLevel] = React.useState(null);
    const [ignoreDefaultMessages, setIgnoreDefaultMessages] = React.useState(true);
    const [logFilteringKeyword, setLogFilteringKeyword] = React.useState('');

    // Pattern-related states
    const [frontPattern, setFrontPattern] = React.useState(null);
    const [rearPattern, setRearPattern] = React.useState(null);

    const [params, setParams] = React.useState({});
    const [trackControl, setTrackControl] = React.useState({ type: null, sections: [] });

    // Pirate-related states
    const [pirate, setPirate] = React.useState({ state: 'ACE000' });
    // Flood-related states
    const [sendPeriodicFloodMessage, setSendPeriodicFloodMessage] = React.useState(false);
    // Timer reference to store the interval ID
    const periodicFloodTimerRef = React.useRef(null);

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
                    const parsedMessage = JSON.parse(msg.message);
                    setLogs((logs) => utils.unshiftFIFO(logs, parsedMessage, 200));

                    // Seaching for pattern changes
                    const { text } = parsedMessage;
                    if (text?.includes('pattern changed')) {
                        console.log('pattern changed');

                        // Use a regular expression to extract the value inside the square brackets after 'to'
                        const match = text.match(/to \[([^\]]+)\]/);

                        // Check if a match is found
                        if (match) {

                            // The value you want is in the first capture group (index 1)
                            const extractedValue = match[1];
                            console.log({ extractedValue });

                            if (text.includes('Front')) {
                                setFrontPattern(extractedValue);
                            } else if (text.includes('Rear')) {
                                setRearPattern(extractedValue);
                            }
                        }
                    }
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
                        const { type, index, name, control } = JSON.parse(msg.message);
                        const newTrackControl = {
                            type,
                            sections: type === trackControl.type ? trackControl.sections : []
                        };

                        const existingSection = newTrackControl.sections.find(s => s.name === name);
                        if (existingSection) {
                            existingSection.control = control;
                        } else {
                            newTrackControl.sections.push({ index, name, control });
                        }

                        return newTrackControl;
                    });
                    break;

                case 'babocar/pirate':
                    console.log(`Topic: babocar/pirate, message: ${JSON.parse(msg.message)}`);
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
        publish('babocar/update-track-control', trackControl);
    }, [publish]);

    const publishPirateProperties = React.useCallback((paramsIn) => {
        // We only support pirate.state now
        const { state } = paramsIn;
        console.log('publishPirateProperties', paramsIn);
        setPirate((pirateParams) => {
            return { ...pirateParams, ...paramsIn };
        });
        publish('babocar/update-pirate', state);
    }, [publish]);

    const publishFlood = React.useCallback(() => {
        // WARNING! This console.log can flood (pun intended) the devtools if you uncomment it
        //console.log(`Send flood message (${FLOOD_MESSAGE_TO_SERIAL})`);
        publish('babocar/update-pirate', FLOOD_MESSAGE_TO_SERIAL);
    }, [publish]);

    // Optional log filtering based on the selected level
    React.useEffect(() => {
        // Preparing time measurement
        //const now = new Date().getTime();
        //console.time(`logs-filtering-${now}`);

        // Optional filtering
        let logsToStore = logs;

        if (ignoreDefaultMessages) {
            //console.log('Ignoring default messages', { ignoreDefaultMessages });
            logsToStore = logsToStore.filter(log => messagesToIgnore.includes(log.text) === false);
        }

        if (selectedLogLevel) {
            //console.log('Filtering logs by level:', { selectedLogLevel });
            logsToStore = logsToStore.filter(log => log.level === selectedLogLevel);
        }
        if (logFilteringKeyword) {
            //console.log('Filtering logs by keyword:', { logFilteringKeyword });
            logsToStore = logsToStore.filter(log => log.text.toLowerCase().includes(logFilteringKeyword.toLowerCase()));
        }

        // Display time measurement
        //console.timeEnd(`logs-filtering-${now}`);

        // Update state variable
        setLogsToRender(logsToStore);
    }, [logs, selectedLogLevel, logFilteringKeyword, ignoreDefaultMessages]);

    useEffect(function sendPeriodicFloodMessageAfterCheckboxChange() {
        console.log('sendPeriodicFloodMessageAfterCheckboxChange', { sendPeriodicFloodMessage });
        // Clear existing timer if it exists when sendPeriodicFloodMessage becomes false
        if (!sendPeriodicFloodMessage && periodicFloodTimerRef.current !== null) {
            clearInterval(periodicFloodTimerRef.current);
            periodicFloodTimerRef.current = null;
        }

        // Start a new timer when sendPeriodicFloodMessage becomes true
        if (sendPeriodicFloodMessage) {
            periodicFloodTimerRef.current = setInterval(() => {
                publishFlood();
            }, FLOOD_PERIOD_TIME_IN_MS);
        }

        // Cleanup the timer on component unmount
        return () => {
            if (periodicFloodTimerRef.current !== null) {
                clearInterval(periodicFloodTimerRef.current);
                periodicFloodTimerRef.current = null;
            }
        };
    }, [sendPeriodicFloodMessage, publishFlood])

    return (
        <div className='app'>
            <Container fluid>
                <Row>
                    <Col>
                        <Header
                            isDirectControlEnabled={car.isRemoteControlled}
                            frontPattern={frontPattern}
                            rearPattern={rearPattern}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={3} xl={3}>
                        <Row>
                            <Col>
                                <PirateCarPropertiesCard
                                    pirate={pirate}
                                    sendParams={publishPirateProperties}
                                    sendPeriodicFloodMessage={sendPeriodicFloodMessage}
                                    handlePeriodicFloodMessageCheckboxClick={() => {
                                        setSendPeriodicFloodMessage((previousValue) => !previousValue)
                                    }}
                                />
                            </Col>
                        </Row>
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
                                            setLogFilteringKeyword={setLogFilteringKeyword}
                                            ignoreDefaultMessages={ignoreDefaultMessages}
                                            setIgnoreDefaultMessages={setIgnoreDefaultMessages}
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
