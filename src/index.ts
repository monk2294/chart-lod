import { simplifyLine } from './engine';
import { computeResolutionFromWidth, sliceData } from './lib';
import { Data } from './types';

export function simplifyDataForResolution(data: Data, from: number, to: number, resolution: number) {
    return simplifyLine(sliceData(data, from, to), resolution);
}

export function simplifyDataForChart(data: Data, from: number, to: number, chartWidth: number) {
    return simplifyLine(sliceData(data, from, to), computeResolutionFromWidth(chartWidth, from, to));
}

export { mergeSimplifiedLines } from './lib';
