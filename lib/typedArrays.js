"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function packToArrayBuffer(data) {
    const buffer = new Float64Array(data.length * 2);
    for (let i = 0, j = 0; i < data.length; i++, j += 2) {
        buffer[j] = data[i][0];
        buffer[j + 1] = data[i][1];
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
