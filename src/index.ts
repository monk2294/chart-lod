import { simplifyLine } from './engine';
import { computeResolutionFromWidth, sliceData } from './lib';

export function simplifyDataForResolution(data: [number, number][], from: number, to: number, resolution: number) {
    return sliceData(simplifyLine(data, resolution), from, to)
}

export function simplifyDataForChart(data: [number, number][], from: number, to: number, chartWidth: number) {
    return simplifyLine(sliceData(data, from, to), computeResolutionFromWidth(chartWidth, from, to));
}

export { mergeSimplifiedLines } from './lib';
