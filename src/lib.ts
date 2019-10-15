/**
 * Search index of point inside data array by nearest X-axis value.
 * @param data data array
 * @param x x-axis value
 */
export function findIndexByNearestX(data: [number, number][], x: number) {
    const len = data.length;
    if (x >= data[len - 1][0]) {
        return len - 1;
    }
    if (x <= data[0][0]) {
        return 0;
    }
    let from: number = 0;
    let to: number = len;
    let pointer = Math.floor((to - from) / 2);
    while (to - from > 1) {
        if (data[pointer][0] >= x) {
            // x on left side
            to = pointer;
        } else {
            // x on right side
            from = pointer;
        }
        pointer = Math.floor((to - from) / 2 + from);
    }
    if (Math.abs(x - data[from][0]) < Math.abs(x - data[to][0])) {
        return from;
    }
    return to;
}

/**
 * Returns combined data array, where areas outside of currentLOD data array are
 * filled with values from lowestLOD data array
 * @param lowestLOD low LOD data array for background
 * @param currentLOD current LOD data array for main area
 */
export function mergeSimplifiedLines(lowestLOD: [number, number][], currentLOD: [number, number][]) {
    const from = findIndexByNearestX(lowestLOD, currentLOD[0][0]);
    const to = findIndexByNearestX(lowestLOD, currentLOD[currentLOD.length - 1][0]);
    const merged: [number, number][] = [];
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

export function computeResolutionFromWidth(width: number, from: number, to: number) {
    return (to - from) / width;
}
