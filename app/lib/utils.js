"use strict";
exports.__esModule = true;
exports.extractText = exports.cn = exports.proxies = void 0;
var clsx_1 = require("clsx");
var tailwind_merge_1 = require("tailwind-merge");
exports.proxies = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K",
    "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Z"];
function cn() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
exports.cn = cn;
;
function extractText(html) {
    return html.replace(/<[^>]+>/g, '');
}
exports.extractText = extractText;
;
