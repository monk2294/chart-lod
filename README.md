# chart-lod
Library is a small set of functions that make it possible to show huge amount of data in plot.

## Installation
```npm i -S chart-lod```

## How it works
Library simplifies data of plot by aggregating multiple points into one. Resulting points are mean values of their subpoints by X-axis and Y-axis. Resolution - a distance on X-axis for one pixel - is computed from plot width.

# How to use
```javascript
import { simplifyDataForChart, mergeSimplifiedLines } from 'chart-lod';

// Get random data
const rawData = getData(1000000);
const chartWidth = 800; // Make sure you have correct value here! It depends on your chart library

// Compute simplifed data
const lowLOD = simplifyDataForChart(rawData, data[0][0], data[data.length - 1][0], chartWidth);

// Compute simplified data for given region by X-axis
const xFrom = -10000, xTo = 10000;
const higherLOD = simplifyDataForChart(rawData, xFrom, xTo, chartWidth);

// Merge simplified data array for dynamic LOD computation
const mergedLODs = mergeSimplifiedLines(lowLOD, higherLOD);



// Generate test data
function getData(n: number) {
    let arr: [number, number][] = [],
        a: number = 0,
        b: number = 0,
        c: number = 0,
        spike: number;
    for (
        let i = 0, x = Date.UTC(new Date().getUTCFullYear(), 0, 1) - n * 36e5;
        i < n;
        i = i + 1, x = x + 36e5
    ) {
        if (i % 100 === 0) {
            a = 2 * Math.random();
        }
        if (i % 1000 === 0) {
            b = 2 * Math.random();
        }
        if (i % 10000 === 0) {
            c = 2 * Math.random();
        }
        if (i % 50000 === 0) {
            spike = 10;
        } else {
            spike = 0;
        }
        arr.push([
            x,
            2 * Math.sin(i / 100) + a + b + c + spike + Math.random()
        ]);
    }
    return arr;
}
```
