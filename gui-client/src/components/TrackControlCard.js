import _ from 'lodash';
import React from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';

function ParameterInput({ valueIn, setValueOut, submitted }) {
    const [type] = React.useState(typeof valueIn);
    const [value, setValue] = React.useState(valueIn);

    if (value !== valueIn && submitted) {
        setValue(valueIn);
    }

    return (
        <Form.Control
            type='text'
            value={typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(2) : value}
            onChange={(e) => {
                setValue(e.target.value);
                setValueOut(type === 'number' ? Number(e.target.value) : e.target.value);
            }} />
    );
}

function SectionEditor({ name, sectionIn, sendTrackControl }) {
    const [section, setSection] = React.useState(sectionIn);
    const [submitted, setSubmitted] = React.useState(true);

    if (!_.isEqual(section, sectionIn) && submitted) {
        setSection({ ...sectionIn });
    }

    const setSectionParam = (path, param) => {
        const newSection = { ...section };
        const lastKey = path.pop();
        path.reduce((obj, key) => obj[key], newSection)[lastKey] = param;
        setSection(newSection);
        setSubmitted(false);
    }

    return (
        <tr style={{ height: '60px' }}>
            <td style={{ textAlign: 'left' }}>
                <b>{name}</b>
            </td>
            <td>
                <ParameterInput
                    valueIn={sectionIn.speed_mps}
                    setValueOut={(v) => setSectionParam(['speed_mps'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <ParameterInput
                    valueIn={sectionIn.rampTime_ms}
                    setValueOut={(v) => setSectionParam(['rampTime_ms'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <ParameterInput
                    valueIn={sectionIn.lineGradient.from.pos_m}
                    setValueOut={(v) => setSectionParam(['lineGradient', 'from', 'pos_m'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <ParameterInput
                    valueIn={sectionIn.lineGradient.from.angle_deg}
                    setValueOut={(v) => setSectionParam(['lineGradient', 'from', 'angle_deg'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <ParameterInput
                    valueIn={sectionIn.lineGradient.to.pos_m}
                    setValueOut={(v) => setSectionParam(['lineGradient', 'to', 'pos_m'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <ParameterInput
                    valueIn={sectionIn.lineGradient.to.angle_deg}
                    setValueOut={(v) => setSectionParam(['lineGradient', 'to', 'angle_deg'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <Button variant="info" disabled={submitted} onClick={() => {
                    sendTrackControl({ name, control: section });
                    setSubmitted(true);
                }}>Send</Button>
            </td>
        </tr>
    );
}

export default function TrackControlCard({ trackControl, sendTrackControl }) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    <Row style={{ paddingLeft: '1rem' }}>
                        <Col>{`Track control: ${trackControl.type ?? 'no'} track`}</Col>
                    </Row>
                </Card.Title>

                <table>
                    <tbody>
                        <tr key={'header1'} style={{ textAlign: 'center', fontWeight: 'bold' }}>
                            <th></th>
                            <th>Speed</th>
                            <th>Ramp</th>
                            <th colSpan={2}>Line start</th>
                            <th colSpan={2}>Line end</th>
                        </tr>
                        <tr key={'header2'} style={{ textAlign: 'center', fontWeight: 'bold' }}>
                            <th style={{ textAlign: 'left' }}>Section</th>
                            <th>[m/s]</th>
                            <th>[ms]</th>
                            <th>[mm]</th>
                            <th>[deg]</th>
                            <th>[mm]</th>
                            <th>[deg]</th>
                        </tr>
                        {Object.keys(trackControl.sections).map((sectionName, i) => {
                            return <SectionEditor
                                key={i}
                                name={sectionName}
                                sectionIn={trackControl.sections[sectionName]}
                                sendTrackControl={sendTrackControl} />
                            }
                        )}
                    </tbody>
                </table>

            </Card.Body>
        </Card>
    )
}
