import React from 'react';
import { Button, Card, Form } from 'react-bootstrap';

function ParameterInput({ name, valueIn, sendParams }) {
    const inputRef = React.useRef(null);
    const [value, setValue] = React.useState(valueIn);

    if (value !== valueIn && document.activeElement !== inputRef.current) {
        setValue(valueIn);
    }

    return (
        <Form.Control
            type='text'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={(target) => {
                if (target.key === 'Enter') {
                    inputRef.current.blur();
                    const validPirateStatePattern = /^[A-Z]{3}\d{3}$/;
                    if (value !== 'LANE!!' && !validPirateStatePattern.test(value)) {
                        console.log(`Invalid pirate state received: ${value}`);
                        return;
                    }
                    sendParams({ [name]: value });
                }
            }} />
    )
}

export default function PirateCarPropertiesCard({
    pirate,
    sendParams,
    sendPeriodicFloodMessage,
    handlePeriodicFloodMessageCheckboxClick,
    sendSingleFloodMessage
}) {

    const tableCellStyle = { padding: "8px" }

    return (
        <Card>
            <Card.Body>
                <Card.Title>Pirate</Card.Title>

                <table style={{ width: "100%" }}>
                    <tbody>
                        <tr>
                            <td style={tableCellStyle}>
                                {pirate.state}
                            </td>
                            <td style={{ width: "100px" }}>
                                <ParameterInput
                                    name={'state'}
                                    valueIn={pirate.state}
                                    sendParams={sendParams}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={tableCellStyle}>
                                Send periodic flood message?
                            </td>
                            <td>
                                <Form.Control
                                    type='checkbox'
                                    value={sendPeriodicFloodMessage}
                                    onChange={() => handlePeriodicFloodMessageCheckboxClick()}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={tableCellStyle}>
                                Single flood message
                            </td>
                            <td>
                                <Button
                                    onClick={() => sendSingleFloodMessage()}
                                >
                                    Send
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Card.Body>
        </Card>
    )
}
