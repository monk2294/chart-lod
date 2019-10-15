export function simplifyLine(data: [number, number][], resolution: number) {
    let result: [number, number][] = [];
    let count = 1;
    let ySum = 0;
    let xTo = data[0][0] + resolution;
    for (let i = 0; i < data.length; i++) {
        const [x, y] = data[i];
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

export function normalizeRawData(data: [number | Date, number][]) {
    return data.map(([x, y]) => {
        if (x instanceof Date) {
            return [x.getTime(), y];
        }
        return [x, y];
    }) as [number, number][];
}
