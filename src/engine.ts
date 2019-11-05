import { Data } from "./types";
import { point } from "./lib";

export function simplifyLine(data: Data, resolution: number) {
    let result: [number, number][] = [];
    if (data.length < 1) {
        return result;
    }
    let count = 0;
    let ySum = 0;
    let xTo = point.x(data[0]) + resolution;
    let x = point.x(data[0]);
    let y = point.y(data[0]);
    for (let i = 0; i < data.length; i++) {
        x = point.x(data[i]);
        y = point.y(data[i]);
        ySum += y;
        count++;
        if (x >= xTo) {
            xTo = x + resolution;
            result.push([x - resolution / 2, ySum / count]);
            ySum = 0;
            count = 0;
        }
    }
    if (count > 1) {
        result.push([x - resolution / 2, ySum / count]);
    }
    return result;
}

export function normalizeRawData(data: [number | Date, number][]) {
    return data.map(([x, y]) => {
        if (x instanceof Date) {
            return [x.getTime(), typeof y === 'number' ? y : NaN];
        }
        return [typeof x === 'number' ? x : NaN, typeof y === 'number' ? y : NaN];
    }) as [number, number][]
}
