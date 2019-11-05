import { Data, Point } from "./types";

export const point = {
    x: (p: Point) => p instanceof Array ? p[0] : p.x,
    y: (p: Point) => p instanceof Array ? p[1] : p.y,
};

/**
 * Search index of point inside data array by nearest X-axis value.
 * @param data data array
 * @param x x-axis value
 */
export function findIndexByNearestX(data: Data, x: number) {
    const len = data.length;
    if (len < 1) {
        return 0;
    }
    if (x >= point.x(data[len - 1])) {
        return len - 1;
    }
    if (x <= point.x(data[0])) {
        return 0;
    }
    let from: number = 0;
    let to: number = len - 1;
    let pointer = Math.floor((to - from) / 2);
    while (to - from > 1) {
        if (point.x(data[pointer]) > x) {
            // x on left side
            to = pointer;
        } else if (point.x(data[pointer]) < x) {
            // x on right side
            from = pointer;
        } else {
            return pointer;
        }
        pointer = Math.floor((to - from) / 2 + from);
    }
    if (Math.abs(x - point.x(data[from])) < Math.abs(x - point.x(data[to]))) {
        return from;
    }
    return to;
}

/**
 * Returns combined data array, where areas outside of currentLOD data array are
 * filled with values from lowestLOD data array
 * @param lowestLOD lowest LOD data array for background
 * @param currentLOD current LOD data array for main area
 */
export function mergeSimplifiedLines(lowestLOD: Data, currentLOD: Data) {
    const from = findIndexByNearestX(lowestLOD, point.x(currentLOD[0]));
    const to = findIndexByNearestX(lowestLOD, point.x(currentLOD[currentLOD.length - 1]));
    const merged: Data = [];
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

/**
 * Returns a slice of data array within given X coordinates
 * @param d data array
 * @param from X from
 * @param to X to
 */
export function sliceData(d: Data, from: number, to: number) {
    const xFrom = findIndexByNearestX(d, from);
    const xTo = findIndexByNearestX(d, to);
    const result =  d.slice(xFrom, xTo + 1);
    return result;
}

export function computeResolutionFromWidth(width: number, from: number, to: number) {
    return (to - from) / width;
}
