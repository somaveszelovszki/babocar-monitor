import React from 'react';
import { Card, Form, Table } from 'react-bootstrap';

function Parameter({ name, valueIn, setParamsOut, index }) {
    const inputRef = React.useRef(null)
    const [value, setValue] = React.useState(valueIn);

    if (value != valueIn && document.activeElement !== inputRef.current) {
        setValue(valueIn);
    }

    let getInput = () => {
        switch (typeof value) {
            case 'boolean':
                return (<Form.Check ref={inputRef} checked={value} onChange={(e) => {
                    setValue(e.target.checked);
                    setParamsOut({ [name]: e.target.checked });
                }} />);

            default:
                return (<Form.Control
                    type='text'
                    ref={inputRef}
                    value={typeof value == 'number' && !Number.isInteger(value) ? value.toFixed(4) : value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyUp={(target) => {
                        if (target.key == 'Enter') {
                            inputRef.current.blur();
                            setParamsOut({ [name]: value });
                        }
                    }} />);
        }
    }

    let style = { background: '#FFFFFF', padding: '0.5rem', verticalAlign: 'middle' };

    return (
        <tr>
            <td style={style} className='text-left'>{name}</td>
            <td style={{ ...style, position: 'sticky', right: 0, minWidth: '8rem', maxWidth: '10rem' }}>{getInput()}</td>
        </tr>
    );
}

export default function ParameterEditorCard({ paramsIn, setParamsOut }) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>Parameter editor</Card.Title>
                <div style={{ maxHeight: '700px', overflowX: 'scroll' }}>
                    <Table>
                        <tbody>
                            {Object.keys(paramsIn).length > 0 ?
                                Object.keys(paramsIn).map((key, index) =>
                                    <Parameter name={key} valueIn={paramsIn[key]} setParamsOut={setParamsOut} index={index} />
                                ) : "Parameter list is empty"}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    )
}
