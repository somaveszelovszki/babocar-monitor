import React from "react";
import { Row, Col, ListGroup, Button } from "react-bootstrap"; // Necessary react-bootstrap components

const createCharArray = (size) => {
    let array = []
    const firstCharacter = 'A'.charCodeAt()
    for (let i = firstCharacter; i < (firstCharacter + size); i++) {
        array.push({
            'section': String.fromCharCode(i),
            'reached': false,
            'hasGate': (i - firstCharacter) < ('P'.charCodeAt() - firstCharacter)
        });
    }
    console.log('createCharArray', array);
    return array
}

export default class Labyrinth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: createCharArray(props.size),
            currentSection: Math.floor(Math.random() * props.size),
            testTimer: null,
            oneSecondTimer: null,
            isManual: true,
            manualSegment: 'A'
        }
        this.handleSectionReached = this.handleSectionReached.bind(this)
        this.findUnreachedSection = this.findUnreachedSection.bind(this)
        this.createListItem = this.createListItem.bind(this)
        this.handleTimerTick = this.handleTimerTick.bind(this)
        this.handleOneSecondTimer = this.handleOneSecondTimer.bind(this)
        this.resetSegmentArray = this.resetSegmentArray.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleManualSelection = this.handleManualSelection.bind(this)
    }

    resetSegmentArray() {
        console.log('resetSegmentArray', this.state.sections);
        let copiedSections = [...this.state.sections]
        copiedSections.forEach(section => {
            section.reached = false
        })
        this.setState(
            {
                sections: copiedSections
            },
            () => this.findUnreachedSection()
        )
    }

    findUnreachedSection() {
        //console.log('findUnreachedSection');
        // Is there a remaining section which is not visited?
        let allSegmentsVisited =
            this.state.sections
                .filter(section => { return section.hasGate === true })
                .every(section => section.reached === true)
        if (!allSegmentsVisited) {
            let index = 0
            // Find an unreached element in the sections array
            do {
                index = Math.floor(Math.random() * ('P'.charCodeAt() - 'A'.charCodeAt()));
            }
            while (this.state.sections[index].reached !== false);
            // Set the found unreached section to current section
            //console.log('New currentSection is', index);
            this.setState({ currentSection: index })
        }
    }

    handleSectionReached(section) {
        //console.log('handleSectionReached', section);
        let copiedSections = [...this.state.sections]
        copiedSections[section].reached = true
        if (this.state.isManual) {
            //console.log('handleSectionReached wait for manual action');
            this.setState(
                {
                    sections: copiedSections
                }
            )
        }
        else {
            if (copiedSections[section].hasGate || true) {
                //console.log('handleSectionReached auto findUnreachedSection');
                this.setState(
                    {
                        sections: copiedSections
                    },
                    () => this.findUnreachedSection()
                )
            }
            else {
                console.log(`Section ${copiedSections[section].label} does not have gate, no new section`);
            }
        }
    }

    handleTimerTick() {
        //console.log('handleTimerTick');
        if (this.state.isManual) {
            //console.log('handleTimerTick wait for manual action');
        }
        else {
            //console.log('handleTimerTick auto handleSectionReached');
            if (this.state.sections.filter(section => { return section.reached === false }).length > 0) {
                this.handleSectionReached(this.state.currentSection)
            }
        }
    }

    handleSegmentReceived(segment) {
        console.log('handleSegmentReceived')
        if (this.state.isManual) {
            console.log('handleSegmentReceived wait for manual action');
        }
        else {
            console.log('handleSegmentReceived auto new segment');
            this.handleSectionReached(segment)
        }
    }

    handleOneSecondTimer() {
        console.log('handleOneSecondTimer');
        if (this.props.socket) {
            this.props.socket.emit('webNewSegment', this.state.currentSection)
        }
    }

    componentDidMount() {
        console.log('Labyrinth componentDidMount', this.props.size, this.state.sections);
        this.findUnreachedSection()
        this.setState({
            //testTimer: setInterval(this.handleTimerTick, 1000),
            oneSecondTimer: setInterval(this.handleOneSecondTimer, 1000)
        })
        // Socket handling
        this.props.socket.on("serialSegmentReceived", data => {
            this.handleSegmentReceived(data.charCodeAt() - 'A'.charCodeAt())
        })
    }

    componentWillUnmount() {
        //clearInterval(this.state.testTimer)
        clearInterval(this.state.oneSecondTimer)
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.checked;
        const name = target.name;

        this.setState({
            [name]: value,
            manualSegment: String.fromCharCode(this.state.currentSection + 'A'.charCodeAt())
        });
    }

    handleManualSelection(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const asciiValue = value.toUpperCase().charCodeAt()
        console.log(`[MANUAL]: letter = ${value}, ascii = ${asciiValue}, array index = ${asciiValue - 'A'.charCodeAt()}`);
        this.setState({
            [name]: value,
            currentSection: asciiValue - 'A'.charCodeAt()
        });
    }

    createListItem(section, index) {
        //console.log('createListItem', section, index, this.state.currentSection);
        let item
        if (section.reached === false) {
            if (this.state.currentSection === index) {
                item = <ListGroup.Item variant="primary">{section.section}</ListGroup.Item>
            }
            else {
                item = <ListGroup.Item variant="danger">{section.section}</ListGroup.Item>
            }
        }
        else {
            item = <ListGroup.Item variant="success">{section.section}</ListGroup.Item>
        }
        return item
    }

    render() {
        //console.log('render', this.state.sections, this.state.currentSection);
        const sectionsList = (
            <ListGroup horizontal>
                {this.state.sections.map((section, index) => {
                    return this.createListItem(section, index)
                })}
            </ListGroup>
        )
        return (
            <Row>
                <Col>
                    <Row className="justify-content-center align-items-center" style = {{ margin: 10 }}>
                        <Col lg="1">
                            <label>
                                Manual
                            <input
                                name="isManual"
                                type="checkbox"
                                checked={this.state.isManual}
                                onChange={this.handleInputChange}
                                style={{ marginLeft: '10px' }}
                            />
                            </label>
                        </Col>
                        {this.state.isManual === true && (
                            <Col lg="3">
                                <label>
                                    Segment
                                <input
                                    name="manualSegment"
                                    type="text"
                                    value={this.state.manualSegment}
                                    onChange={this.handleManualSelection}
                                    style={{ marginLeft: '10px', paddingLeft: '10px' }}
                                />
                                </label>
                            </Col>
                        )}
                        <Col lg="1">
                            <Button onClick={() => this.resetSegmentArray()} variant="danger">
                                Reset
                </Button>
                        </Col>

                    </Row>
                    <Row className="justify-content-md-center">
                        <Col xl="auto">
                            {sectionsList}
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}

