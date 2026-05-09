// BILLIARD
var BILLIARD = {VERSION: "1.0.0"};
(function(BILLIARD) {
"use strict";
BILLIARD.correctFloatingPointError = function(val, precision) {
    if (null == precision) precision = 10;
    var _loc_3 = Math.pow(10, precision);
    return Math.round(_loc_3 * val) / _loc_3;
};
})(BILLIARD);