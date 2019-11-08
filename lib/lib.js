"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
function extractX(p) {
    if (p instanceof Array) {
        return p[0];
    }
    // @ts-ignore
    return p.x;
}
function extractY(p) {
    if (p instanceof Array) {
        return p[1];
    }
    // @ts-ignore
    return p.y;
}
exports.point = {
    x: extractX,
    y: extractY,
};
/**
 * Search index of point inside data array by nearest X-axis value.
 * @param data data array
 * @param x x-axis value
 */
function findIndexByNearestX(data, x) {
    const minPoint = findNearestValuablePoint(data, 0);
    const maxPoint = findNearestValuablePoint(data, data.length - 1);
    const len = data.length;
    if (len < 1) {
        return 0;
    }
    if (x >= exports.point.x(maxPoint)) {
        return len - 1;
    }
    if (x <= exports.point.x(minPoint)) {
        return 0;
    }
    let from = 0;
    let to = len - 1;
    let pointer = Math.floor((to - from) / 2);
    while (to - from > 1) {
        let p = findNearestValuablePoint(data, pointer);
        if (exports.point.x(p) > x) {
            // x on left side
            to = pointer;
        }
        else if (exports.point.x(p) < x) {
            // x on right side
            from = pointer;
        }
        else {
            return pointer;
        }
        pointer = Math.floor((to - from) / 2 + from);
    }
    const fromPoint = findNearestValuablePoint(data, from);
    const toPoint = findNearestValuablePoint(data, to);
    if (Math.abs(x - exports.point.x(fromPoint)) < Math.abs(x - exports.point.x(toPoint))) {
        return from;
    }
    return to;
}
exports.findIndexByNearestX = findIndexByNearestX;
/**
 * Returns combined data array, where areas outside of currentLOD data array are
 * filled with values from lowestLOD data array
 * @param lowestLOD lowest LOD data array for background
 * @param currentLOD current LOD data array for main area
 */
function mergeSimplifiedLines(lowestLOD, currentLOD) {
    // minPoint and maxPoint 
    try {
        const minPoint = findNearestValuablePoint(currentLOD, 0);
        const maxPoint = findNearestValuablePoint(currentLOD, currentLOD.length - 1);
        const from = findIndexByNearestX(lowestLOD, exports.point.x(minPoint));
        const to = findIndexByNearestX(lowestLOD, exports.point.x(maxPoint));
        const merged = [];
        let i = 0, j = 0;
        for (j = 0; j < from; j++, i++) {
            merged[i] = lowestLOD[j];
        }
        for (j = 0; j < currentLOD.length; j++, i++) {
            merged[i] = currentLOD[j];
        }
        for (j = to + 1; j < lowestLOD.length; j++, i++) {
            merged[i] = lowestLOD[j];
        }
        return merged;
    }
    catch (error) {
        if (error instanceof errors_1.NoValuablePointError) {
            console.warn('Empty space has been discovered. Using currentLOD');
            return lowestLOD;
        }
        throw error;
    }
}
exports.mergeSimplifiedLines = mergeSimplifiedLines;
/**
 * Returns a slice of data array within given X coordinates
 * @param d data array
 * @param from X from
 * @param to X to
 */
function sliceData(d, from, to) {
    const xFrom = findIndexByNearestX(d, from);
    const xTo = findIndexByNearestX(d, to);
    const result = d.slice(xFrom, xTo + 1);
    return result;
}
exports.sliceData = sliceData;
function computeResolutionFromWidth(width, from, to) {
    return (to - from) / width;
}
exports.computeResolutionFromWidth = computeResolutionFromWidth;
function findNearestValuablePoint(data, index) {
    if (isValuablePoint(data[index])) {
        return data[index];
    }
    let i = index - 1;
    let j = index + 1;
    while (i >= 0 || j < data.length) {
        if (i >= 0) {
            const p = data[i--];
            if (isValuablePoint(p)) {
                return p;
            }
        }
        if (j < data.length && data[j++]) {
            const p = data[j++];
            if (isValuablePoint(p)) {
                return p;
            }
        }
    }
    throw new errors_1.NoValuablePointError('No valuable point was found in array. Probably invalid array has been passed');
}
exports.findNearestValuablePoint = findNearestValuablePoint;
function isValuablePoint(point) {
    return !!point && point instanceof Array && point[0] !== null && point[1] !== null;
}
exports.isValuablePoint = isValuablePoint;
