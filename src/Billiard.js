// BILLIARD
var BILLIARD = {VERSION: "1.1.0"};

Function.prototype.inheritsFrom = function(parentClassOrObject) {
    var C = this, P;
    if (parentClassOrObject.constructor === Function)
    {
        P = function(){};
        P.prototype = parentClassOrObject.prototype;
        C.prototype = new P();
        C.prototype.constructor = C;
        C.prototype.parent = parentClassOrObject.prototype;
    }
    else
    {
        C.prototype = parentClassOrObject;
        C.prototype.constructor = C;
        C.prototype.parent = parentClassOrObject;
    }
    return C;
};

(function(BILLIARD) {
"use strict";
BILLIARD.correctFloatingPointError = function(val, precision) {
    if (null == precision) precision = 6;
    var powOfTen = Math.pow(10, precision);
    return Math.round(powOfTen * val) / powOfTen;
};
})(BILLIARD);