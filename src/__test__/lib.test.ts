import { findIndexByNearestX, mergeSimplifiedLines, sliceData, computeResolutionFromWidth, point } from '../lib';
import { NoValuablePointError } from '../errors';

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
    it('should throw error for empty array', () => {
        expect(() => findIndexByNearestX([], 0)).toThrowError(NoValuablePointError);
        // const index = findIndexByNearestX([], 0);
        // expect(index).toBe(0);
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

describe('sliceData', () => {
    it('should return correct slice of data', () => {
        const data = generateData(15, 0, 2); // [[0, float], [2, float], ..., [198, float]]
        [
            {
                sliceParams: { from: 5, to: 10 },
                firstX: 6,
                lastX: 10
            },
            {
                sliceParams: { from: 5, to: 8.5 },
                firstX: 6,
                lastX: 8
            },
            {
                sliceParams: { from: 4, to: 8.99 },
                firstX: 4,
                lastX: 8
            },
        ].forEach(({ sliceParams: { from, to }, firstX, lastX }) => {
            const slice = sliceData(data, from, to);
            expect(point.x(slice[0])).toBe(firstX);
            expect(point.x(slice[slice.length - 1])).toBe(lastX);
        });
    });
});

describe('computeResolutionFromWidth', () => {
    it('should return correct result', () => {
        const to = 5000;
        const from = 4000;
        const width = 800;
        expect(computeResolutionFromWidth(width, from, to))
            .toBe((to - from) / width)
    });
});
