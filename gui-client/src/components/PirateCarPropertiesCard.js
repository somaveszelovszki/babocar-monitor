import React from 'react';
import { Card, Form } from 'react-bootstrap';

function ParameterInput({ name, valueIn, sendParams }) {
    const inputRef = React.useRef(null);
    const [value, setValue] = React.useState(valueIn);

    if (value !== valueIn && document.activeElement !== inputRef.current) {
        setValue(valueIn);
    }

    return (
        <Form.Control
            type='text'
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={(target) => {
                if (target.key === 'Enter') {
                    inputRef.current.blur();
                    sendParams({ [name]: value });
                }
            }} />
    )
}

export default function PirateCarPropertiesCard({ pirate, sendParams }) {

    const inputStyle = {
        display: 'inline-block',
        tableLayout: 'fixed',
        verticalAlign: 'top',
        width: '7rem'
    };

    const margin = '15px';

    return (
        <Card>
            <Card.Body>
                <Card.Title>Pirate</Card.Title>

                <table style={{
                    display: 'inline-block',
                    overflowX: 'scroll',
                    verticalAlign: 'top',
                    width: `calc(100% - ${inputStyle.width} - ${margin})`,
                    borderLeft: 0,
                    marginRight: margin
                }}>
                    <tbody>
                        {Object.keys(pirate).map((key) =>
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
                        {Object.entries(pirate).map(([key, value]) => {
                            return (

                                <tr key={key} style={{ height: '60px' }}>
                                    <td>
                                        <ParameterInput
                                            name={key}
                                            valueIn={value}
                                            sendParams={sendParams}
                                        />
                                    </td>
                                </tr>
                            )
                        }
                        )}
                    </tbody>
                </table>

            </Card.Body>
        </Card>
    )
}
