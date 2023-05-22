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

        const bbox = utils.squareBoundingBox2d(positions, 1);
        const grid = {
            x: [Math.floor(bbox.x[0]), Math.ceil(bbox.x[1])],
            y: [Math.floor(bbox.y[0]), Math.ceil(bbox.y[1])]
        };

        function convert(pos) {
            return {
                x: utils.scale(pos.x, bbox.x, [0, context.canvas.width]),
                y: utils.scale(pos.y, bbox.y, [context.canvas.height, 0])
            };
        }

        function drawLine(from, to, color) {
            context.beginPath();
            context.moveTo(from.x, from.y);
            context.lineTo(to.x, to.y);
            context.strokeStyle = color;
            context.lineWidth = 1;
            context.stroke();
        }

        function drawText(text, pos) {
            context.beginPath();
            context.font = '18px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'top';
            context.fillStyle = 'black';
            context.fillText(text, pos.x, pos.y);
            context.stroke();
        }

        for (let x = grid.x[0]; x <= grid.x[1]; x++) {
            drawLine(convert({ x: x, y: grid.y[0] }), convert({ x: x, y: grid.y[1] }), 'grey');
            drawText(x.toString(), convert({ x: x, y: 0 }));
        }

        for (let y = grid.y[0]; y <= grid.y[1]; y++) {
            drawLine(convert({ x: grid.x[0], y: y }), convert({ x: grid.x[1], y }), 'grey');
            drawText(y.toString(), convert({ x: 0, y: y }));
        }

        let prev = convert(positions[0]);
        positions.forEach(pos => {
            const current = convert(pos);
            drawLine(prev, current, 'red');
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
