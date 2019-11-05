"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Search index of point inside data array by nearest X-axis value.
 * @param data data array
 * @param x x-axis value
 */
function findIndexByNearestX(data, x) {
    const len = data.length;
    if (len < 1) {
        return 0;
    }
    if (x >= data[len - 1][0]) {
        return len - 1;
    }
    if (x <= data[0][0]) {
        return 0;
    }
    let from = 0;
    let to = len;
    let pointer = Math.floor((to - from) / 2);
    while (to - from > 1) {
        if (data[pointer][0] > x) {
            // x on left side
            to = pointer;
        }
        else if (data[pointer][0] < x) {
            // x on right side
            from = pointer;
        }
        else {
            return pointer;
        }
        pointer = Math.floor((to - from) / 2 + from);
    }
    if (Math.abs(x - data[from][0]) < Math.abs(x - data[to][0])) {
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
    const from = findIndexByNearestX(lowestLOD, currentLOD[0][0]);
    const to = findIndexByNearestX(lowestLOD, currentLOD[currentLOD.length - 1][0]);
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
