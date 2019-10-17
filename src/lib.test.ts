import { findIndexByNearestX, mergeSimplifiedLines } from './lib';

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

describe('findIndexByNearestX', () => {
    it('should return 0 for empty array', () => {
        const index = findIndexByNearestX([], 0);
        expect(index).toBe(0);
    });

    it('should find index of point if given X is inside array', () => {
        const data = generateData(100);
        expect(findIndexByNearestX(data, 54.5)).toBe(55);
        expect(findIndexByNearestX(data, 54.49)).toBe(54);
    });

    it('should return 0 or index of last element if given X is outside of range of given array', () => {
        const data = generateData(100);
        expect(findIndexByNearestX(data, -100)).toBe(0);
        expect(findIndexByNearestX(data, 109)).toBe(99);
    });
});

describe('mergeSimplifiedLines', () => {
    it('should merge higher LOD inside lower LOD', () => {
        const lowestLOD = generateData(10, 0, 10);
        const lod = generateData(10, 21, 1);
        const merged = mergeSimplifiedLines(lowestLOD, lod);
        let i = 0;
        // Lowest LOD
        for (; i < 2; i++) {
            expect(merged[i]).toEqual(lowestLOD[i])
        }
        // Current LOD
        for (let j = 0; j < lod.length; i++, j++) {
            expect(merged[i]).toEqual(lod[j]);
        }
        // Lowest LOD again
        for(let j = merged.length - 1, k = lowestLOD.length - 1; j >= i; j--, k--) {
            expect(merged[j]).toEqual(lowestLOD[k]);
        }
    });

    it('should put higher LOD first then fill the rest with lower LOD', () => {
        const lowestLOD = generateData(10, 0, 10);
        const lod = generateData(10, 0, 1);
        const merged = mergeSimplifiedLines(lowestLOD, lod);
        let i = 0;
        // Current LOD
        for (let j = 0; j < lod.length; i++, j++) {
            expect(merged[i]).toEqual(lod[j]);
        }
        // Lowest LOD
        for(let j = merged.length - 1, k = lowestLOD.length - 1; j >= i; j--, k--) {
            expect(merged[j]).toEqual(lowestLOD[k]);
        }
    });

    it('should put higher LOD at last then fill the rest with lower LOD', () => {
        const lowestLOD = generateData(10, 0, 10); // [[0, float], ..., [90, float]]
        const lod = generateData(10, 90, 1);
        const merged = mergeSimplifiedLines(lowestLOD, lod);
        let i = 0;
        // Lowest LOD
        for (; i < 9; i++) {
            expect(merged[i]).toEqual(lowestLOD[i])
        }
        // Current LOD
        for (let j = 0; j < lod.length; i++, j++) {
            expect(merged[i]).toEqual(lod[j]);
        }
    });
});
