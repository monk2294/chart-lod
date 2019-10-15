import * as Highcharts from 'highcharts';
import { simplifyDataForChart, mergeSimplifiedLines } from '../src';

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

const points = 1000000;
const data = getData(points).sort((a, b) => a[0] - b[0]);
const globalMinX = data[0][0];
const globalMaxX = data[data.length - 1][0];

const minLOD = simplifyDataForChart(data, globalMinX, globalMaxX, window.innerWidth);

const chart = Highcharts.chart('chart', {
    chart: {
        zoomType: 'x',
        panKey: 'alt',
        panning: true,
    },
    title: {
        text: 'Highcharts drawing ' + points + ' points'
    },

    subtitle: {
        text: 'Using the Boost module'
    },

    tooltip: {
        valueDecimals: 2
    },

    xAxis: {
        type: 'datetime',
        events: {
            setExtremes: event => {
                const isPan = event.trigger === 'pan';
                const width = chart.chartWidth;
                const min = event.min || globalMinX;
                const max = event.max || globalMaxX;
                if (min !== undefined && max !== undefined) {
                    if (isPan) {
                        updateDataDebounced(data, min, max, width)
                    } else {
                        updateData(data, min, max, width);
                    }
                }
            },
            afterSetExtremes: event => {
                console.log(event);
            }
        }
    },

    series: [{
        type: 'line',
        data: minLOD,
        lineWidth: 1,
        name: 'random data'
    }]
});

function updateData(...args: Parameters<typeof simplifyDataForChart>) {
    chart.xAxis[0].series[0].setData(mergeSimplifiedLines(minLOD, simplifyDataForChart(...args)), true);
}

let debounceTimer: any = null;
function updateDataDebounced(...args: Parameters<typeof simplifyDataForChart>) {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
        debounceTimer = null;
        updateData(...args);
    }, 1000);
}
