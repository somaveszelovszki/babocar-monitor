/*
 * Utility functions and types.
 */

export function formatDate(date) {
    let hh = String(date.getHours()).padStart(2, '0');
    let mm = String(date.getMinutes()).padStart(2, '0');
    let ss = String(date.getSeconds()).padStart(2, '0');
    let ms = String(date.getMilliseconds()).padEnd(3, '0');

    return `${hh}:${mm}:${ss}.${ms}`
}

export function pushFIFO(array, element, limit) {
    let newArray = [...array, element];
    if (newArray.length > limit) {
        newArray.shift();
    }
    return newArray;
}

export function unshiftFIFO(array, element, limit) {
    let newArray = [element, ...array];
    if (newArray.length > limit) {
        newArray.pop();
    }
    return newArray;
}
