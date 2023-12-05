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

function SectionEditor({ index, name, controlIn, sendTrackControl }) {
    const [control, setControl] = React.useState(controlIn);
    const [submitted, setSubmitted] = React.useState(true);

    if (!_.isEqual(control, controlIn) && submitted) {
        setControl({ ...controlIn });
    }

    const setControlParam = (path, param) => {
        const newControl = { ...control };
        const lastKey = path.pop();
        path.reduce((obj, key) => obj[key], newControl)[lastKey] = param;
        setControl(newControl);
        setSubmitted(false);
    }

    return (
        <tr style={{ height: '60px' }}>
            <td style={{ textAlign: 'left' }}>
                <b>{name}</b>
            </td>
            <td>
                <ParameterInput
                    valueIn={controlIn.speed_mps}
                    setValueOut={(v) => setControlParam(['speed_mps'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <ParameterInput
                    valueIn={controlIn.rampTime_ms}
                    setValueOut={(v) => setControlParam(['rampTime_ms'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <ParameterInput
                    valueIn={controlIn.lineGradient.from.pos_m}
                    setValueOut={(v) => setControlParam(['lineGradient', 'from', 'pos_m'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <ParameterInput
                    valueIn={controlIn.lineGradient.from.angle_deg}
                    setValueOut={(v) => setControlParam(['lineGradient', 'from', 'angle_deg'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <ParameterInput
                    valueIn={controlIn.lineGradient.to.pos_m}
                    setValueOut={(v) => setControlParam(['lineGradient', 'to', 'pos_m'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <ParameterInput
                    valueIn={controlIn.lineGradient.to.angle_deg}
                    setValueOut={(v) => setControlParam(['lineGradient', 'to', 'angle_deg'], v)}
                    submitted={submitted} />
            </td>
            <td>
                <Button variant="info" disabled={submitted} onClick={() => {
                    sendTrackControl({ index, control });
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
                        {trackControl.sections.map(s =>
                            <SectionEditor
                                key={s.index}
                                index={s.index}
                                name={s.name}
                                controlIn={s.control}
                                sendTrackControl={sendTrackControl} />
                        )}
                    </tbody>
                </table>

            </Card.Body>
        </Card>
    )
}
