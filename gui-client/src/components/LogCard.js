import { Button, Card, Col, Container, ListGroup, Row, Table } from 'react-bootstrap';

import * as utils from '../Utils'

function getColor(level) {
    switch (level) {
        case 'D': return 'light';
        case 'I': return 'info';
        case 'W': return 'warning';
        case 'E': return 'danger';
        default: return null;
    }
}

function getText(level) {
    switch (level) {
        case 'D': return 'Debug';
        case 'I': return 'Info';
        case 'W': return 'Warn';
        case 'E': return 'Error';
        default: return null;
    }
}

function Log({ log }) {
    const border = { borderRight: '1px solid #000000' };

    return (
        <tr className={`bg-${getColor(log.level)}`}>
            <td style={{ ...border, width: '6rem' }}>{utils.formatDate(new Date(log.timestamp))}</td>
            <td style={{ ...border, width: '3rem' }}>{getText(log.level)}</td>
            <td className='text-left'>{log.text}</td>
        </tr>
    )
}

export default function LogCard({ logs, setLogs }) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    <Row style={{ paddingLeft: '1rem' }}>
                        <Col>Logs</Col>
                        <Col>
                            <Button variant="danger" onClick={() => { setLogs([]) }}>Clear</Button>
                        </Col>
                    </Row>
                </Card.Title>

                <div className='table-responsive text-nowrap' style={{ width: '100%', maxHeight: '700px', overflow: 'scroll' }}>
                    <Table className='table'>
                        <tbody>
                            {logs.length > 0 ? logs.map((log, index) => (<Log log={log} key={index} />)) : <tr key='log-empty'><td>Log list is empty</td></tr>}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    );
}
