"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function simplifyLine(data, resolution) {
    var result = [];
    var count = 1;
    var ySum = 0;
    var xTo = data[0][0] + resolution;
    for (var i = 0; i < data.length; i++) {
        var _a = data[i], x = _a[0], y = _a[1];
        ySum += y;
        if (x > xTo) {
            xTo = x + resolution;
            result.push([x, ySum / count]);
            ySum = 0;
            count = 0;
        }
        count++;
    }
    return result;
}
exports.simplifyLine = simplifyLine;
function normalizeRawData(data) {
    return data.map(function (_a) {
        var x = _a[0], y = _a[1];
        if (x instanceof Date) {
            return [x.getTime(), y];
        }
        return [x, y];
    });
}
exports.normalizeRawData = normalizeRawData;
