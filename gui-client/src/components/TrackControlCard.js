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

function SectionEditor({ sectionIn, setSectionOut, submitted }) {
    const [section, setSection] = React.useState(sectionIn);

    if (!_.isEqual(section, sectionIn) && submitted) {
        setSection({ ...sectionIn });
    }

    const setSectionParam = (path, param) => {
        const newSection = { ...section };
        const lastKey = path.pop();
        path.reduce((obj, key) => obj[key], newSection.control)[lastKey] = param;
        setSection(newSection);
        setSectionOut(newSection);
    }

    return (
        <tr style={{ height: '60px' }}>
            <td style={{ textAlign: 'left' }}>
                {section.name}
            </td>
            <td>
                <ParameterInput
                    valueIn={sectionIn.control.speed_mps}
                    setValueOut={(v) => setSectionParam(['speed_mps'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <ParameterInput
                    valueIn={sectionIn.control.rampTime_ms}
                    setValueOut={(v) => setSectionParam(['rampTime_ms'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <ParameterInput
                    valueIn={sectionIn.control.lineGradient.from.pos_m}
                    setValueOut={(v) => setSectionParam(['lineGradient', 'from', 'pos_m'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <ParameterInput
                    valueIn={sectionIn.control.lineGradient.from.angle_deg}
                    setValueOut={(v) => setSectionParam(['lineGradient', 'from', 'angle_deg'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <ParameterInput
                    valueIn={sectionIn.control.lineGradient.to.pos_m}
                    setValueOut={(v) => setSectionParam(['lineGradient', 'to', 'pos_m'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <ParameterInput
                    valueIn={sectionIn.control.lineGradient.to.angle_deg}
                    setValueOut={(v) => setSectionParam(['lineGradient', 'to', 'angle_deg'], v)}
                    submitted={submitted} />
            </td>
        </tr>
    );
}

export default function TrackControlCard({ trackControlIn, setTrackControlOut }) {
    const [trackControl, setTrackControl] = React.useState(trackControlIn);
    const [submitted, setSubmitted] = React.useState(true);

    if (!_.isEqual(trackControl, trackControlIn) && submitted) {
        setTrackControl({ ...trackControlIn });
    }

    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    <Row style={{ paddingLeft: '1rem' }}>
                        <Col>{`Track control: ${trackControl.type ? trackControl.type : 'no'} track`}</Col>
                        <Col>
                            <Button variant="info" disabled={submitted} onClick={() => {
                                setTrackControlOut({ ...trackControl });
                                setSubmitted(true);
                            }}>Send</Button>
                        </Col>
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
                        {trackControlIn.sections.map((section, i) =>
                            <SectionEditor
                                key={i}
                                sectionIn={section}
                                setSectionOut={(s) => {
                                    const newTrackControl = { ...trackControl };
                                    newTrackControl.sections[i] = s;
                                    setTrackControl(newTrackControl);
                                    setSubmitted(false);
                                }}
                                submitted={submitted} />
                        )}
                    </tbody>
                </table>

            </Card.Body>
        </Card>
    )
}
