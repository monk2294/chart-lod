import { simplifyLine } from './engine';
import { computeResolutionFromWidth, findIndexByNearestX } from './lib';

export function simplifyDataForResolution(data: [number, number][], from: number, to: number, resolution: number) {
    return sliceData(simplifyLine(data, resolution), from, to)
}

export function simplifyDataForChart(data: [number, number][], from: number, to: number, chartWidth: number) {
    return simplifyLine(sliceData(data, from, to), computeResolutionFromWidth(chartWidth, from, to));
}

function sliceData(d: [number, number][], from: number, to: number) {
    const xFrom = findIndexByNearestX(d, from);
    const xTo = findIndexByNearestX(d, to);
    const result =  d.slice(xFrom, xTo);
    return result;
}

export { mergeSimplifiedLines } from './lib';
