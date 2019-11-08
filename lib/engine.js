"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
function splitAndSimplify(data, resolution) {
    let minX = Infinity;
    let maxX = -Infinity;
    const lines = [];
    let current = [];
    for (let i = 0; i < data.length; i++) {
        const p = data[i];
        if (lib_1.isValuablePoint(p)) {
            const x = lib_1.point.x(p);
            if (minX > x) {
                minX = x;
            }
            else if (maxX < x) {
                maxX = x;
            }
            current.push(p);
        }
        else if (current.length > 0) {
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
            const nextLine = lines[index + 1];
            const x = (lib_1.point.x(line[line.length - 1]) + lib_1.point.x(nextLine[0])) / 2;
            data.push([x, null]);
        }
        return data;
    }, []);
    if (!lib_1.isValuablePoint(data[0])) {
        result.unshift([minX - 1, null]);
    }
    if (!lib_1.isValuablePoint(data[data.length - 1])) {
        result.push([maxX + 1, null]);
    }
    return result;
}
exports.splitAndSimplify = splitAndSimplify;
function simplifyLine(data, resolution) {
    let result = [];
    if (data.length < 1) {
        return result;
    }
    let count = 0;
    let ySum = 0;
    let xFrom = lib_1.point.x(data[0]);
    let xTo = lib_1.point.x(data[0]) + resolution;
    let x = lib_1.point.x(data[0]);
    let y = lib_1.point.y(data[0]);
    for (let i = 0; i < data.length; i++) {
        x = lib_1.point.x(data[i]);
        y = lib_1.point.y(data[i]);
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
exports.simplifyLine = simplifyLine;
function normalizeRawData(data) {
    return data.map(([x, y]) => {
        if (x instanceof Date) {
            return [x.getTime(), typeof y === 'number' ? y : NaN];
        }
        return [typeof x === 'number' ? x : NaN, typeof y === 'number' ? y : NaN];
    });
}
exports.normalizeRawData = normalizeRawData;
