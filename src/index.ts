import { normalizeRawData, simplifyLine } from './engine';
import { computeResolutionFromWidth } from './lib';

type RawDataType = Parameters<typeof normalizeRawData>[0];

export function simplifyDataForResolution(data: RawDataType, from: number, to: number, resolution: number) {
    return simplifyLine(normalizeRawData(data), resolution).filter(i => i[0] >= from && i[0] <= to);
}

export function simplifyDataForChart(data: RawDataType, from: number, to: number, chartWidth: number) {
    let resolution: number = computeResolutionFromWidth(chartWidth, from, to);
    return simplifyLine(normalizeRawData(data), resolution).filter(i => i[0] >= from && i[0] <= to);
}

export { mergeSimplifiedLines as mergeData } from './lib';
