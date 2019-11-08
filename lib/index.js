"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("./engine");
const lib_1 = require("./lib");
function simplifyDataForResolution(data, from, to, resolution) {
    return engine_1.splitAndSimplify(lib_1.sliceData(data, from, to), resolution);
}
exports.simplifyDataForResolution = simplifyDataForResolution;
function simplifyDataForChart(data, from, to, chartWidth) {
    return engine_1.splitAndSimplify(lib_1.sliceData(data, from, to), lib_1.computeResolutionFromWidth(chartWidth, from, to));
}
exports.simplifyDataForChart = simplifyDataForChart;
var lib_2 = require("./lib");
exports.mergeSimplifiedLines = lib_2.mergeSimplifiedLines;
