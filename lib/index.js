"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var engine_1 = require("./engine");
var lib_1 = require("./lib");
function simplifyDataForResolution(data, from, to, resolution) {
    return sliceData(engine_1.simplifyLine(data, resolution), from, to);
}
exports.simplifyDataForResolution = simplifyDataForResolution;
function simplifyDataForChart(data, from, to, chartWidth) {
    return engine_1.simplifyLine(sliceData(data, from, to), lib_1.computeResolutionFromWidth(chartWidth, from, to));
}
exports.simplifyDataForChart = simplifyDataForChart;
function sliceData(d, from, to) {
    var xFrom = lib_1.findIndexByNearestX(d, from);
    var xTo = lib_1.findIndexByNearestX(d, to);
    var result = d.slice(xFrom, xTo);
    return result;
}
var lib_2 = require("./lib");
exports.mergeSimplifiedLines = lib_2.mergeSimplifiedLines;
