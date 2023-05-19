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
