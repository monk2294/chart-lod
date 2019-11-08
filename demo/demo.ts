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
const data = getData(points).sort((a, b) => a[0] - b[0])
// .map((p, index) => {
//     if (index > 100000 && index < 510000) {
//         return null;
//     }
//     return p;
// });
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
        valueDecimals: 2,
        formatter: function () {
            return `x=${this.x}, y=${this.y}`;
        }
    },

    xAxis: {
        type: 'datetime',
        events: {
            setExtremes: event => {
                const isPan = event.trigger === 'pan';
                const isResetZoom = event.trigger === 'zoom' &&
                    event.min === undefined &&
                    event.max === undefined;
                const width = chart.chartWidth;
                const min = event.min || globalMinX;
                const max = event.max || globalMaxX;
                if (isResetZoom) {
                    setDataToChart(minLOD);
                } else if (min !== undefined && max !== undefined) {
                    updateData({ from: min, to: max, chartWidth: width }, data, minLOD);
                }
            }
        }
    },

    series: [{
        type: 'line',
        data: minLOD,
        lineWidth: 1,
        name: 'random data',
        connectNulls: false,
    }]
});

function setDataToChart(data) {
    chart.xAxis[0].series[0].setData(data, true, false);
}

let timer: any = null;
function updateData(...args: [any, any, any]) {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        const [{ from, to, chartWidth }, data, baseLOD] = args;
        setDataToChart(mergeSimplifiedLines(baseLOD, simplifyDataForChart(data, from, to, chartWidth)));
        timer = null;
    }, 100);
}
