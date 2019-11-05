import { Data } from "./types";
import { point } from "./lib";

export function packToArrayBuffer(data: Data) {
    const buffer = new Float64Array(data.length * 2);
    for (let i = 0, j = 0; i < data.length; i++, j += 2) {
        buffer[j] = point.x(data[i]);
        buffer[j + 1] = point.y(data[i]);
    }
    return buffer.buffer;
}

export function unpackFromArrayBuffer(arrayBuffer: ArrayBuffer) {
    const buffer = new Float64Array(arrayBuffer);
    const data: Data = [];
    for (let i = 0, j = 0; i < buffer.length; i += 2, j++) {
        data[j] = [buffer[i], buffer[i + 1]];
    }
    return data;
}
