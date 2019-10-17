export function simplifyLine(data: [number, number][], resolution: number) {
    let result: [number, number][] = [];
    if (data.length < 1) {
        return result;
    }
    let count = 0;
    let ySum = 0;
    let xTo = data[0][0] + resolution;
    let [x, y] = data[0];
    for (let i = 0; i < data.length; i++) {
        x = data[i][0];
        y = data[i][1];
        ySum += y;
        count++;
        if (x >= xTo) {
            xTo = x + resolution;
            result.push([x - resolution / 2, ySum / count]);
            ySum = 0;
            count = 0;
        }
    }
    if (count > 1) {
        result.push([x - resolution / 2, ySum / count]);
    }
    return result;
}

export function normalizeRawData(data: [number | Date, number][]) {
    return data.map(([x, y]) => {
        if (x instanceof Date) {
            return [x.getTime(), typeof y === 'number' ? y : NaN];
        }
        return [typeof x === 'number' ? x : NaN, typeof y === 'number' ? y : NaN];
    }) as [number, number][]
}
