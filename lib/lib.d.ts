/**
 * Search index of point inside data array by nearest X-axis value.
 * @param data data array
 * @param x x-axis value
 */
export declare function findIndexByNearestX(data: [number, number][], x: number): number;
/**
 * Returns combined data array, where areas outside of currentLOD data array are
 * filled with values from lowestLOD data array
 * @param lowestLOD low LOD data array for background
 * @param currentLOD current LOD data array for main area
 */
export declare function mergeSimplifiedLines(lowestLOD: [number, number][], currentLOD: [number, number][]): [number, number][];
export declare function computeResolutionFromWidth(width: number, from: number, to: number): number;