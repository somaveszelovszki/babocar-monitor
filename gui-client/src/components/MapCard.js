import React from 'react';
import { Card } from 'react-bootstrap';

export default function MapCard({ car }) {
    const [positions, setPositions] = React.useState([car.pos_m]);

    if (positions.at(-1) !== car.pos_m) {
        setPositions([...positions, car.pos_m]);
    }

    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const context = canvasRef.current.getContext('2d');
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        const mapSize = { x: 10, y: 10 };

        function convert(pos) {
            return {
                x: context.canvas.width / 2 + pos.x / mapSize.x * context.canvas.width,
                y: context.canvas.height / 2 - pos.y / mapSize.y * context.canvas.height
            };
        }

        let prev = convert(positions[0]);
        positions.forEach(pos => {
            const current = convert(pos);
            context.beginPath();
            context.moveTo(prev.x, prev.y);
            context.lineTo(current.x, current.y);
            context.strokeStyle = 'red';
            context.lineWidth = 1;
            context.stroke();

            prev = current;
        });

    }, [positions]);

    return (
        <Card>
            <Card.Body>
                <Card.Title>Map</Card.Title>
                <div className='square'>
                    <canvas ref={canvasRef} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
                </div>
            </Card.Body>
        </Card>
    )
}
