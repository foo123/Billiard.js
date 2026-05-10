// BILLIARD
var BILLIARD = {VERSION: "1.0.0"};

(function(BILLIARD) {
"use strict";
BILLIARD.correctFloatingPointError = function(val, precision) {
    if (null == precision) precision = 10;
    var powOfTen = Math.pow(10, precision);
    return Math.round(powOfTen * val) / powOfTen;
};
})(BILLIARD);