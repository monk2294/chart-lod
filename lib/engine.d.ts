import { RawData, ValuableData, Data } from "./types";
export declare function splitAndSimplify(data: RawData, resolution: number): Data;
export declare function simplifyLine(data: ValuableData, resolution: number): [number, number][];
export declare function normalizeRawData(data: [number | Date, number][]): [number, number][];
