import { splitAndSimplify } from './engine';
import { computeResolutionFromWidth, sliceData } from './lib';
import { RawData } from './types';

export function simplifyDataForResolution(data: RawData, from: number, to: number, resolution: number) {
    return splitAndSimplify(sliceData(data, from, to), resolution);
}

export function simplifyDataForChart(data: RawData, from: number, to: number, chartWidth: number) {
    return splitAndSimplify(sliceData(data, from, to), computeResolutionFromWidth(chartWidth, from, to));
}

export { mergeSimplifiedLines } from './lib';
