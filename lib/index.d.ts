import { Data } from './types';
export declare function simplifyDataForResolution(data: Data, from: number, to: number, resolution: number): [number, number][];
export declare function simplifyDataForChart(data: Data, from: number, to: number, chartWidth: number): [number, number][];
export { mergeSimplifiedLines } from './lib';
