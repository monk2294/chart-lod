import { simplifyLine } from './engine';
import { computeResolutionFromWidth, findIndexByNearestX } from './lib';

export function simplifyDataForResolution(data: [number, number][], from: number, to: number, resolution: number) {
    const result = sliceData(simplifyLine(data, resolution), from, to)
    return result;
}

export function simplifyDataForChart(data: [number, number][], from: number, to: number, chartWidth: number) {
    let resolution: number = computeResolutionFromWidth(chartWidth, from, to);
    const result = simplifyLine(sliceData(data, from, to), resolution);
    return result;
}

function sliceData(d: [number, number][], from: number, to: number) {
    const xFrom = findIndexByNearestX(d, from);
    const xTo = findIndexByNearestX(d, to);
    const result =  d.slice(xFrom, xTo);
    return result;
}

export { mergeSimplifiedLines } from './lib';
