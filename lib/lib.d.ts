import { Data, RawData, RawPoint, ValuablePoint, Point } from "./types";
declare type ExtractorReturn<T> = T extends [number, null] ? number | null : T extends ValuablePoint ? number : never;
declare function extractX<T>(p: T): ExtractorReturn<T>;
declare function extractY<T extends Point>(p: T): ExtractorReturn<T>;
export declare const point: {
    x: typeof extractX;
    y: typeof extractY;
};
/**
 * Search index of point inside data array by nearest X-axis value.
 * @param data data array
 * @param x x-axis value
 */
export declare function findIndexByNearestX(data: RawData, x: number): number;
/**
 * Returns combined data array, where areas outside of currentLOD data array are
 * filled with values from lowestLOD data array
 * @param lowestLOD lowest LOD data array for background
 * @param currentLOD current LOD data array for main area
 */
export declare function mergeSimplifiedLines(lowestLOD: Data, currentLOD: Data): Point[];
/**
 * Returns a slice of data array within given X coordinates
 * @param d data array
 * @param from X from
 * @param to X to
 */
export declare function sliceData(d: RawData, from: number, to: number): RawPoint[];
export declare function computeResolutionFromWidth(width: number, from: number, to: number): number;
export declare function findNearestValuablePoint(data: RawData, index: number): ValuablePoint;
export declare function isValuablePoint(point: RawPoint): boolean;
export {};
