import { RawData } from './types';
export declare function simplifyDataForResolution(data: RawData, from: number, to: number, resolution: number): import("./types").Point[];
export declare function simplifyDataForChart(data: RawData, from: number, to: number, chartWidth: number): import("./types").Point[];
export { mergeSimplifiedLines } from './lib';
