import { packToArrayBuffer, unpackFromArrayBuffer } from '../typedArrays';

const generateData = (n: number, from: number = 0, inc: number = 1) => {
    const result: [number, number][] = [];
    for (let i = 0; i < n; i += 1) {
        result.push([
            from + i * inc,
            Math.random()
        ]);
    }
    return result;
};

describe('typedArrays', () => {
    it('should create correct size of ArrayBuffer', () => {
        const data = generateData(100);
        const ab = packToArrayBuffer(data);
        expect(ab.byteLength).toBe(16 * 100);
    });

    it('should return equal data array', () => {
        const originalData = generateData(100);
        const unpackedData = unpackFromArrayBuffer(packToArrayBuffer(originalData));
        expect(originalData).toEqual(unpackedData);
    });
});
