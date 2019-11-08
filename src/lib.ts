import { Data, RawData, RawPoint, ValuablePoint, Point } from "./types";
import { NoValuablePointError } from "./errors";

type ExtractorReturn<T> = T extends [number, null] ? number | null : T extends ValuablePoint ? number : never;

function extractX<T>(p: T): ExtractorReturn<T> {
    if (p instanceof Array) {
        return p[0];
    }
    // @ts-ignore
    return p.x;
}

function extractY<T extends Point>(p: T): ExtractorReturn<T> {
    if (p instanceof Array) {
        return p[1];
    }
    // @ts-ignore
    return p.y;
}

export const point = {
    x: extractX,
    y: extractY,
};

/**
 * Search index of point inside data array by nearest X-axis value.
 * @param data data array
 * @param x x-axis value
 */
export function findIndexByNearestX(data: RawData, x: number) {
    const minPoint = findNearestValuablePoint(data, 0);
    const maxPoint = findNearestValuablePoint(data, data.length - 1);
    const len = data.length;
    if (len < 1) {
        return 0;
    }
    if (x >= point.x(maxPoint)) {
        return len - 1;
    }
    if (x <= point.x(minPoint)) {
        return 0;
    }
    let from: number = 0;
    let to: number = len - 1;
    let pointer = Math.floor((to - from) / 2);
    while (to - from > 1) {
        let p = findNearestValuablePoint(data, pointer);
        if (point.x(p) > x) {
            // x on left side
            to = pointer;
        } else if (point.x(p) < x) {
            // x on right side
            from = pointer;
        } else {
            return pointer;
        }
        pointer = Math.floor((to - from) / 2 + from);
    }
    const fromPoint = findNearestValuablePoint(data, from);
    const toPoint = findNearestValuablePoint(data, to);
    if (Math.abs(x - point.x(fromPoint)) < Math.abs(x - point.x(toPoint))) {
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
    // minPoint and maxPoint 
    try {
        const minPoint = findNearestValuablePoint(currentLOD, 0);
        const maxPoint = findNearestValuablePoint(currentLOD, currentLOD.length - 1);
        const from = findIndexByNearestX(lowestLOD, point.x(minPoint));
        const to = findIndexByNearestX(lowestLOD, point.x(maxPoint));
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
    } catch (error) {
        if (error instanceof NoValuablePointError) {
            console.warn('Empty space has been discovered. Using currentLOD');
            return lowestLOD;
        }
        throw error;
    }
}

/**
 * Returns a slice of data array within given X coordinates
 * @param d data array
 * @param from X from
 * @param to X to
 */
export function sliceData(d: RawData, from: number, to: number) {
    const xFrom = findIndexByNearestX(d, from);
    const xTo = findIndexByNearestX(d, to);
    const result =  d.slice(xFrom, xTo + 1);
    return result;
}

export function computeResolutionFromWidth(width: number, from: number, to: number) {
    return (to - from) / width;
}

export function findNearestValuablePoint(data: RawData, index: number) {
    if (isValuablePoint(data[index])) {
        return data[index] as ValuablePoint;
    }
    let i = index - 1;
    let j = index + 1;
    while (i >= 0 || j < data.length) {
        if (i >= 0) {
            const p = data[i--];
            if (isValuablePoint(p)) {
                return p as ValuablePoint;
            }
        }
        if (j < data.length && data[j++]) {
            const p = data[j++];
            if (isValuablePoint(p)) {
                return p as ValuablePoint;
            }
        }
    }
    throw new NoValuablePointError('No valuable point was found in array. Probably invalid array has been passed');
}

export function isValuablePoint(point: RawPoint) {
    return !!point && point instanceof Array && point[0] !== null && point[1] !== null;
}
