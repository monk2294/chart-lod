import { Data, Point } from "./types";
import { point } from "./lib";

export function packToArrayBuffer(data: Data) {
    const buffer = new Float64Array(data.length * 2);
    for (let i = 0, j = 0; i < data.length; i++, j += 2) {
        buffer[j] = encodeValue(point.x(data[i]));
        buffer[j + 1] = encodeValue(point.y(data[i]));
    }
    return buffer.buffer;
}

export function unpackFromArrayBuffer(arrayBuffer: ArrayBuffer) {
    const buffer = new Float64Array(arrayBuffer);
    const data: Data = [];
    for (let i = 0, j = 0; i < buffer.length; i += 2, j++) {
        data[j] = [
            buffer[i],
            decodeValue(buffer[i + 1])
        ] as Point;
    }
    return data;
}

function encodeValue(v: number | null) {
    if (v === null) {
        return NaN;
    }
    return v;
}

function decodeValue(v: number) {
    if (isNaN(v)) {
        return null;
    }
    return v;
}
