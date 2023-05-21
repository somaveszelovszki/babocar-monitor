import { contain } from 'intrinsic-scale';
import React from 'react';
import { Card } from 'react-bootstrap';
import * as utils from '../Utils'

export default function MapCard({ car }) {
    const [positions, setPositions] = React.useState([car.pos_m]);

    if (positions.at(-1) !== car.pos_m) {
        setPositions([...positions, car.pos_m]);
    }

    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const context = canvasRef.current.getContext('2d');

        const dimensions = contain(
            context.canvas.clientWidth,
            context.canvas.clientHeight,
            context.canvas.width,
            context.canvas.height
        );

        context.canvas.width = dimensions.width;
        context.canvas.height = dimensions.height;

        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        const posBounds = utils.squareBoundingBox2d(positions);

        const padding = 30;
        const canvasBounds = {
            x: [padding, context.canvas.width - padding],
            y: [context.canvas.height - padding, padding]
        };

        function convert(pos) {
            return {
                x: utils.scale(pos.x, posBounds.x, canvasBounds.x),
                y: utils.scale(pos.y, posBounds.y, canvasBounds.y)
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
                    <canvas ref={canvasRef} width='100' height='100' style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
            </Card.Body>
        </Card>
    )
}
