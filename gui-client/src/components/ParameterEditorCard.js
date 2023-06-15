import React from 'react';
import { Card, Form } from 'react-bootstrap';

function ParameterInput({ name, valueIn, setParamsOut }) {
    const inputRef = React.useRef(null);
    const [type] = React.useState(typeof valueIn);
    const [value, setValue] = React.useState(valueIn);

    if (value !== valueIn && document.activeElement !== inputRef.current) {
        setValue(valueIn);
    }

    switch (typeof value) {
        case 'boolean':
            return (
                <input type='checkbox' ref={inputRef} checked={value} onChange={(e) => {
                    setValue(e.target.checked);
                    setParamsOut({ [name]: e.target.checked });
                }} />
            );

        default:
            return (
                <Form.Control
                    type='text'
                    ref={inputRef}
                    value={typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(4) : value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyUp={(target) => {
                        if (target.key === 'Enter') {
                            inputRef.current.blur();
                            setParamsOut({ [name]: type === 'number' ? Number(value) : value });
                        }
                    }} />
            );
    }
}

export default function ParameterEditorCard({ paramsIn, setParamsOut }) {
    const inputStyle = {
        display: 'inline-block',
        tableLayout: 'fixed',
        verticalAlign: 'top',
        width: '7rem'
    };

    const margin = '15px';

    if (paramsIn.length === 0) {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>Parameter editor</Card.Title>
                    Parameter list is empty
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card>
            <Card.Body>
                <Card.Title>Parameter editor</Card.Title>

                <table style={{
                    display: 'inline-block',
                    overflowX: 'scroll',
                    verticalAlign: 'top',
                    width: `calc(100% - ${inputStyle.width} - ${margin})`,
                    borderLeft: 0,
                    marginRight: margin
                }}>
                    <tbody>
                        {Object.keys(paramsIn).map((key) =>
                            <tr key={key} style={{ height: '60px', textAlign: 'left' }}>
                                <td>
                                    {key}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <table style={inputStyle}>
                    <tbody>
                        {Object.keys(paramsIn).map((key) =>
                            <tr key={key} style={{ height: '60px' }}>
                                <td>
                                    <ParameterInput name={key} valueIn={paramsIn[key]} setParamsOut={setParamsOut} />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </Card.Body>
        </Card>
    )
}
