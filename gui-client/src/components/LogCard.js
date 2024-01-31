import { Button, Card, Col, Row, Table, Form } from 'react-bootstrap';
import * as utils from '../Utils'
import { useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'

export const LOG_LEVELS = {
    DEBUG: 'D',
    INFO: 'I',
    WARNING: 'W',
    ERROR: 'E'
};

function getColor(level) {
    switch (level) {
        case LOG_LEVELS.DEBUG: return 'light';
        case LOG_LEVELS.INFO: return 'info';
        case LOG_LEVELS.WARNING: return 'warning';
        case LOG_LEVELS.ERROR: return 'danger';
        default: return null;
    }
}

function getText(level) {
    switch (level) {
        case LOG_LEVELS.DEBUG: return 'Debug';
        case LOG_LEVELS.INFO: return 'Info';
        case LOG_LEVELS.WARNING: return 'Warn';
        case LOG_LEVELS.ERROR: return 'Error';
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

function LogLevelSelector({ selectedLogLevel, setSelectedLogLevel }) {
    const defaultOption = "Select log level";
    return (
        <div>
            <Form.Select
                value={selectedLogLevel}
                onChange={(event) => setSelectedLogLevel(event.target.value === defaultOption ? null : event.target.value)}
            >
                <option value={null}>{defaultOption}</option>
                <option value={LOG_LEVELS.DEBUG}>Debug</option>
                <option value={LOG_LEVELS.INFO}>Info</option>
                <option value={LOG_LEVELS.WARNING}>Warn</option>
                <option value={LOG_LEVELS.ERROR}>Error</option>
            </Form.Select>
        </div>
    );
}

function LogFilteringKeywordInput({ setLogFilteringKeyword }) {

    const [keyword, setKeyword] = useState('');
    const debouncedValue = useDebounce(keyword, 500);

    useEffect(() => {
        // Triggers when "debouncedValue" changes
        setLogFilteringKeyword(debouncedValue);
    }, [debouncedValue, setLogFilteringKeyword])

    return (
        <div>
            Filter:{' '}
            <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
            />
            {debouncedValue && ` (debounced: ${debouncedValue})`}
        </div>
    );
}

export default function LogCard({
    logs,
    setLogs,
    selectedLogLevel,
    setSelectedLogLevel,
    setLogFilteringKeyword,
    ignoreDefaultMessages,
    setIgnoreDefaultMessages
}) {

    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    <Row style={{ paddingLeft: '1rem' }}>
                        <Col>Logs</Col>
                        <Col>
                            <Button variant="danger" onClick={() => { setLogs([]) }}>Clear</Button>
                        </Col>
                        <Col>
                            <LogLevelSelector
                                selectedLogLeve={selectedLogLevel}
                                setSelectedLogLevel={setSelectedLogLevel}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <LogFilteringKeywordInput setLogFilteringKeyword={setLogFilteringKeyword} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            Ignore default messages:
                            <input
                                type="checkbox"
                                value={ignoreDefaultMessages}
                                onChange={() => setIgnoreDefaultMessages((previous) => !previous)}
                            />
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
