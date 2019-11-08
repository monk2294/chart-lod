import { RawData, ValuableData, ValuablePoint, Data } from "./types";
import { point, isValuablePoint } from "./lib";

export function splitAndSimplify(data: RawData, resolution: number): Data {
    let minX = Infinity;
    let maxX = -Infinity;
    const lines: ValuableData[] = [];
    let current: ValuableData = [];
    for (let i = 0; i < data.length; i++) {
        const p = data[i];
        if (isValuablePoint(p)) {
            const x = point.x(p as ValuablePoint);
            if (minX > x) {
                minX = x;
            } else if (maxX < x) {
                maxX = x;
            }
            current.push(p as ValuablePoint);
        } else if (current.length > 0) {
            lines.push(current);
            current = [];
        }
    }
    if (current.length) {
        lines.push(current);
    }
    const result = lines.reduce((data, line, index) => {
        const simplified = simplifyLine(line, resolution);
        data = data.concat(simplified);
        if (index !== lines.length - 1) {
            const nextLine = lines[index + 1]
            const x = (point.x(line[line.length - 1]) + point.x(nextLine[0])) / 2;
            data.push([x, null]);
        }
        return data;
    }, [] as Data);
    if (!isValuablePoint(data[0])) {
        result.unshift([minX - 1, null]);
    }
    if (!isValuablePoint(data[data.length - 1])) {
        result.push([maxX + 1, null]);
    }
    return result;
}

export function simplifyLine(data: ValuableData, resolution: number) {
    let result: [number, number][] = [];
    if (data.length < 1) {
        return result;
    }
    let count = 0;
    let ySum = 0;
    let xFrom = point.x(data[0]);
    let xTo = point.x(data[0]) + resolution;
    let x = point.x(data[0]);
    let y = point.y(data[0]);
    for (let i = 0; i < data.length; i++) {
        x = point.x(data[i]);
        y = point.y(data[i]);
        ySum += y;
        count++;
        if (x >= xTo) {
            result.push([(xFrom + xTo) / 2, ySum / count]);
            xFrom = x;
            xTo = x + resolution;
            ySum = 0;
            count = 0;
        }
    }
    if (count >= 1) {
        result.push([(xFrom + xTo) / 2, ySum / count]);
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
