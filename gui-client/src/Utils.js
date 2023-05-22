/*
 * Utility functions and types.
 */

export function formatDate(date) {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padEnd(3, '0');

    return `${hh}:${mm}:${ss}.${ms}`
}

export function pushFIFO(array, element, limit) {
    const newArray = [...array, element];
    if (newArray.length > limit) {
        newArray.shift();
    }
    return newArray;
}

export function unshiftFIFO(array, element, limit) {
    const newArray = [element, ...array];
    if (newArray.length > limit) {
        newArray.pop();
    }
    return newArray;
}

export function scale(value, fromRange, toRange) {
    return toRange[0] + (value - fromRange[0]) / (fromRange[1] - fromRange[0]) * (toRange[1] - toRange[0]);
}

export function boundingBox2d(positions, padding = 0) {
    const bbox = {
        x: [Math.min(...positions.map(pos => pos.x)), Math.max(...positions.map(pos => pos.x))],
        y: [Math.min(...positions.map(pos => pos.y)), Math.max(...positions.map(pos => pos.y))]
    };

    return {
        x: [bbox.x[0] - padding, bbox.x[1] + padding],
        y: [bbox.y[0] - padding, bbox.y[1] + padding]
    };
}

export function squareBoundingBox2d(positions, padding = 0) {
    const bbox = boundingBox2d(positions, padding);
    const mid = { x: (bbox.x[1] + bbox.x[0]) / 2, y: (bbox.y[1] + bbox.y[0]) / 2 };
    const size = Math.max(bbox.x[1] - bbox.x[0], bbox.y[1] - bbox.y[0]);
    return { x: [mid.x - size / 2, mid.x + size / 2], y: [mid.y - size / 2, mid.y + size / 2] };
}
