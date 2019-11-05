"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
function packToArrayBuffer(data) {
    const buffer = new Float64Array(data.length * 2);
    for (let i = 0, j = 0; i < data.length; i++, j += 2) {
        buffer[j] = lib_1.point.x(data[i]);
        buffer[j + 1] = lib_1.point.y(data[i]);
    }
    return buffer.buffer;
}
exports.packToArrayBuffer = packToArrayBuffer;
function unpackFromArrayBuffer(arrayBuffer) {
    const buffer = new Float64Array(arrayBuffer);
    const data = [];
    for (let i = 0, j = 0; i < buffer.length; i += 2, j++) {
        data[j] = [buffer[i], buffer[i + 1]];
    }
    return data;
}
exports.unpackFromArrayBuffer = unpackFromArrayBuffer;
