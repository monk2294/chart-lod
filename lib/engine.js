"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
function simplifyLine(data, resolution) {
    let result = [];
    if (data.length < 1) {
        return result;
    }
    let count = 0;
    let ySum = 0;
    let xTo = lib_1.point.x(data[0]) + resolution;
    let x = lib_1.point.x(data[0]);
    let y = lib_1.point.y(data[0]);
    for (let i = 0; i < data.length; i++) {
        x = lib_1.point.x(data[i]);
        y = lib_1.point.y(data[i]);
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
