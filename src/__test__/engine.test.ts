import { normalizeRawData, simplifyLine } from '../engine';

describe('simplifyLine', () => {
    const generateData = (n: number) => {
        const result: [number, number][] = [];
        for (let i = 0; i < n; i++) {
            result.push([
                i,
                Math.random()
            ]);
        }
        return result;
    };

    it('should divide space into predictable amount of groups', () => {
        const len = 100;
        for (const resolution of [9, 10, 11]) {
            const data = generateData(len);
            const maxX = data[len - 1][0];
            const simplifiedData = simplifyLine(data, resolution); 
            expect(simplifiedData.length).toBe(Math.ceil(maxX / resolution));
        }
    });

    it('should compute X coordinate of simplified line correct', () => {
        const data = generateData(100);
        const result = simplifyLine(data, 10);
        expect(result[0][0]).toBe(5);
        expect(result[9][0]).toBe(94);
    });

    it('should compute Y coordinate of simplified line as mean', () => {
        const data = generateData(100);
        const result = simplifyLine(data, 10);
        let ySum = 0;
        let i = 0;
        for (; data[i][0] <= 10; i++) {
            ySum += data[i][1];
        }
        expect(result[0][1]).toEqual(ySum / i);
    });

    it('should return empty array if passed empty data', () => {
        const data = [] as [number, number][];
        const result = simplifyLine(data, 10);
        expect(result.length).toBe(0);
    });
});

describe('normalizeRawData', () => {
    it('should return new empty array', () => {
        const arg: [] = [];
        const result = normalizeRawData(arg);
        expect(arg).not.toBe(result);
    });

    it('should return time if Date is given as first element of subarray', () => {
        const d = new Date();
        const arg = [[d, 2], [1, 2]] as [number | Date, number][];
        const result = normalizeRawData(arg);
        expect(result[0][0]).toBe(d.getTime());
        expect(result[1][0]).toBe(arg[1][0]);
    });

    it('should return NaN if given argument that is not a number', () => {
        const arg = [
            [0, 1],
            [true, false],
            [{}, ''],
            [0, ''],
            [{}, 1],
        ] as [number, number][];
        const result = normalizeRawData(arg);
        expect(result[0][0]).toBe(arg[0][0]);
        expect(result[0][1]).toBe(arg[0][1]);
        expect(result[1].every(i => isNaN(i))).toBe(true);
        expect(result[2].every(i => isNaN(i))).toBe(true);
        expect(result[3][0]).toBe(arg[3][0]);
        expect(isNaN(result[3][1])).toBe(true);
        expect(result[4][1]).toBe(arg[4][1]);
        expect(isNaN(result[4][0])).toBe(true);
    });
});
